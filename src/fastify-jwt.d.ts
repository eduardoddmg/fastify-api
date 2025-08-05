import '@fastify/jwt';

// Este bloco "aumenta" o módulo '@fastify/jwt'
declare module '@fastify/jwt' {
  // A interface FastifyJWT é onde definimos a estrutura do nosso payload
  interface FastifyJWT {
    // payload é usado para tipar o que passamos para a função sign
    // No seu caso, você passa { name: user.name }
    payload: {
      name: string;
    };

    // user é usado para tipar o que recebemos em request.user após a verificação
    // Ele contém tudo do payload + as propriedades padrão do JWT (sub, iat, exp)
    user: {
      sub: string;
      name: string;
      iat: number;
      exp: number;
    };
  }
}
