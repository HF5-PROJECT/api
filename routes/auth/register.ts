import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hashSync } from "bcrypt";

export default async (fastify: FastifyInstance) => {
    fastify.post(
        "/register",
        async (
            request: FastifyRequest<{
                Body: {
                    email: string;
                    password: string;
                    name: string;
                    address: string;
                };
            }>,
            reply: FastifyReply
        ) => {
            const emailRegEx =
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            const isEmailValid = emailRegEx.test(request.body.email);

            if (!isEmailValid) {
                return reply.badRequest("email is invalid");
            }

            const isEmailInUse =
                (await fastify.prisma.user.findFirst({
                    where: { email: request.body.email },
                })) !== null;

            if (isEmailInUse) {
                return reply.badRequest("email is already in use");
            }

            const user = await fastify.prisma.user.create({
                data: {
                    email: request.body.email,
                    password: hashSync(request.body.password, 10),
                    name: request.body.name,
                    address: request.body.address,
                },
            });

            reply.code(200).send({
                token: fastify.jwt.sign({
                    sub: user.id,
                    iat: Date(),
                }),
            });
        }
    );
};
