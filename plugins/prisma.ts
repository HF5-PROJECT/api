import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export default fastifyPlugin(
    async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
        const prisma = new PrismaClient();

        await prisma.$connect();

        // Make Prisma Client available through the fastify server instance: server.prisma
        fastify.decorate("prisma", prisma);

        fastify.addHook("onClose", async (server) => {
            await server.prisma.$disconnect();
        });
    }
);
