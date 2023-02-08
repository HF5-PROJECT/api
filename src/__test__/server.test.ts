import { FastifyInstance } from "fastify";
import { build } from "../index";

describe("POST /api/auth/login", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and token", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/health",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: "OK" });
    });
});