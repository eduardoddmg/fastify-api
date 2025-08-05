import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from './lib/prisma';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const createUserBody = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });

    const { name, email } = createUserBody.parse(request.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    const user = await prisma.user.create({
      data: { name, email },
    });

    return reply.status(201).send(user);
  });

  app.get('/users', async (request, reply) => {
    const getUsersQuery = z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(10),
    });

    const { page, pageSize } = getUsersQuery.parse(request.query);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Executa as duas queries em paralelo para melhor performance
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return reply.status(200).send({
      items: users,
      pagination: {
        totalItems: total,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  });

  app.get('/users/:id', async (request, reply) => {
    const getUserParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = getUserParams.parse(request.params);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return reply.status(404).send({ message: 'Usuário não encontrado.' });
    }

    return reply.status(200).send(user);
  });

  app.put('/users/:id', async (request, reply) => {
    const updateUserParams = z.object({
      id: z.string().uuid(),
    });
    const updateUserBody = z
      .object({
        name: z.string().min(3).optional(),
        email: z.string().email().optional(),
      })
      .strict(); // .strict() não permite propriedades extras

    const { id } = updateUserParams.parse(request.params);
    const data = updateUserBody.parse(request.body);

    if (Object.keys(data).length === 0) {
      return reply.status(400).send({ message: 'Nenhum dado para atualizar.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return reply.status(200).send(updatedUser);
  });

  app.delete('/users/:id', async (request, reply) => {
    const deleteUserParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteUserParams.parse(request.params);

    // Verifica se o usuário existe antes de tentar deletar
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return reply.status(404).send({ message: 'Usuário não encontrado.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    return reply.status(204).send(); // 204 No Content
  });
}
