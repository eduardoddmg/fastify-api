import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../hooks/auth';
import { Status } from '@prisma/client';

export async function taskRoutes(app: FastifyInstance) {
  // Aplica o hook de autenticação a TODAS as rotas deste plugin
  app.addHook('onRequest', authenticate);

  // ROTA: Criar uma nova tarefa
  app.post('/', async (request, reply) => {
    const createTaskBody = z.object({
      title: z.string().min(3),
      description: z.string(),
    });

    const { title, description } = createTaskBody.parse(request.body);
    const userId = request.user.sub; // ID do usuário vem do token JWT

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return reply.status(201).send(task);
  });

  // ROTA: Listar todas as tarefas do usuário (com paginação, busca e filtro)
  app.get('/', async (request, reply) => {
    const getTasksQuery = z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(50).default(10),
      search: z.string().optional(),
      status: z.nativeEnum(Status).optional(),
    });

    const { page, pageSize, search, status } = getTasksQuery.parse(
      request.query
    );
    const userId = request.user.sub;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Constrói a cláusula 'where' dinamicamente
    const where = {
      userId,
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
      ...(status && { status }),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        skip,
        take,
      }),
      prisma.task.count({ where }),
    ]);

    return reply.status(200).send({
      items: tasks,
      pagination: {
        totalItems: total,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  });

  // ROTA: Atualizar uma tarefa
  app.put('/:id', async (request, reply) => {
    const updateTaskParams = z.object({ id: z.string().uuid() });
    const updateTaskBody = z.object({
      title: z.string().min(3).optional(),
      description: z.string().optional(),
      status: z.nativeEnum(Status).optional(),
    });

    const { id } = updateTaskParams.parse(request.params);
    const data = updateTaskBody.parse(request.body);
    const userId = request.user.sub;

    // Verifica se a tarefa existe e se pertence ao usuário logado
    const taskExists = await prisma.task.findFirst({ where: { id, userId } });
    if (!taskExists) {
      return reply
        .status(404)
        .send({ message: 'Tarefa não encontrada ou não pertence a você.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    return reply.status(200).send(updatedTask);
  });

  // ROTA: Deletar uma tarefa
  app.delete('/:id', async (request, reply) => {
    const deleteTaskParams = z.object({ id: z.string().uuid() });
    const { id } = deleteTaskParams.parse(request.params);
    const userId = request.user.sub;

    // Verifica se a tarefa existe e se pertence ao usuário logado
    const taskExists = await prisma.task.findFirst({ where: { id, userId } });
    if (!taskExists) {
      return reply
        .status(404)
        .send({ message: 'Tarefa não encontrada ou não pertence a você.' });
    }

    await prisma.task.delete({ where: { id } });

    return reply.status(204).send();
  });
}
