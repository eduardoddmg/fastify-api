import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const createUserBody = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6), // Aumentei o mínimo para senhas mais seguras
    });

    const { name, email, password } = createUserBody.parse(request.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    // Hash da senha antes de salvar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Salva a senha com hash
      },
    });

    // Não retorne a senha, mesmo que hasheada
    const { password: _, ...userWithoutPassword } = user;

    return reply.status(201).send(userWithoutPassword);
  });

  app.post('/login', async (request, reply) => {
    const loginUserBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginUserBody.parse(request.body);

    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    // 2. Comparar a senha fornecida com a senha hasheada no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    // 3. Gerar o token JWT
    const token = await reply.jwtSign(
      {
        // Payload: informações que você quer incluir no token
        name: user.name,
      },
      {
        // Configurações do token
        sign: {
          sub: user.id, // 'subject' do token, geralmente o ID do usuário
          expiresIn: '7d', // Token expira em 7 dias
        },
      }
    );

    return reply.status(200).send({ token });
  });
}
