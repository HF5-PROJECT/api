import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyRedis, { FastifyRedis } from "@fastify/redis";

declare module "fastify" {
    interface FastifyRequest {
        redis: FastifyRedis;
    }
}

export default fastifyPlugin(
    async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
        await fastify.register(fastifyRedis, {
            host: fastify.config.REDIS_HOST,
            password: fastify.config.REDIS_PASSWORD,
            family: 4,
        });

        fastify.addHook("preHandler", (req, reply, next) => {
            req.redis = fastify.redis;
            return next();
        });
    },
    { dependencies: ["config"] }
);
