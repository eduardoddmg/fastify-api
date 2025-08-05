import Fastify from 'fastify';
import { appRoutes } from './routes';
import { ZodError } from 'zod';

const app = Fastify();

// Registra as rotas da aplicação
app.register(appRoutes);

// Tratamento de erros global com Zod
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação',
      issues: error.format(),
    });
  }

  // Outros erros podem ser tratados aqui
  console.error(error); // É bom logar o erro para debug

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
