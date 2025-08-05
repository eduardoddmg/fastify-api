import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

export async function userRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const createUserBody = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserBody.parse(request.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return reply.status(201).send(userWithoutPassword);
  });

  app.post('/login', async (request, reply) => {
    const loginUserBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginUserBody.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return reply.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const token = await reply.jwtSign(
      {
        name: user.name,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    );

    return reply.status(200).send({ token });
  });
}
