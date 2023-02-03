import { FastifyInstance } from "fastify";
import { build } from "../../app";

describe("GET /api/health", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status OK", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/health",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: "OK" });
    });
});