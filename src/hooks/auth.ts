import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Hook de autenticação que verifica se o usuário possui um token JWT válido.
 * Se o token for válido, a requisição prossegue.
 * Se não, retorna um erro 401 Unauthorized.
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply
      .status(401)
      .send({ message: 'Acesso não autorizado. Token inválido ou expirado.' });
  }
}
