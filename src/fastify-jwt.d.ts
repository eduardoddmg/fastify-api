import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      name: string;
    };

    user: {
      sub: string;
      name: string;
      iat: number;
      exp: number;
    };
  }
}
