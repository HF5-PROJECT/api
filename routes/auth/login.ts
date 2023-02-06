import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { compareSync } from "bcrypt";

export default async (fastify: FastifyInstance) => {
    fastify.post(
        "/login",
        async (
            request: FastifyRequest<{
                Body: {
                    email: string;
                    password: string;
                };
            }>,
            reply: FastifyReply
        ) => {
            const user = await fastify.prisma.user.findFirst({
                where: { email: request.body.email },
            });

            if (!user || !compareSync(request.body.password, user.password)) {
                return reply.unauthorized("email and/or password incorrect");
            }

            reply.code(200).send({
                token: fastify.jwt.sign({
                    sub: user.id,
                    iat: Date(),
                }),
            });
        }
    );
};
