import Fastify from 'fastify';
import { appRoutes } from './routes';
import { ZodError } from 'zod';
import fastifyJwt from '@fastify/jwt';
import { userRoutes } from './modules/user/user.route';
import { taskRoutes } from './modules/task/task.routes';

const app = Fastify();

app.register(userRoutes, {
  prefix: '/user',
});

app.register(taskRoutes, {
  prefix: '/task',
});

app.register(fastifyJwt, {
  secret: 'supersecret',
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: error.format(),
    });
  }

  console.error(error);

  return reply.status(500).send({ message: 'Erro interno do servidor' });
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Servidor HTTP rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
