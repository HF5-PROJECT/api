import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
    fastify.get("/health", async (request, response) => {
        return { status: "OK" };
    });
};
