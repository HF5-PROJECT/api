import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fastifyPlugin(
    async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
        fastify.register(fastifyJwt, {
            secret: "supersecretsecret",
        });

        fastify.decorate(
            "authenticate",
            async (request: FastifyRequest, reply: FastifyReply) => {
                try {
                    await request.jwtVerify();
                } catch (err) {
                    reply.send(err);
                }
            }
        );
    }
);
