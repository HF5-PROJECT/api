import { FastifyInstance } from "fastify";
import { build } from "../../../app";

describe("POST /api/auth/register", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.prisma.user.deleteMany();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and create a user", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/register",
            payload: {
                name: "Joe Biden",
                email: "joe@biden.com",
                address:
                    "1600 Pennsylvania Avenue NW, Washington, DC 20500, USA",
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(fastify.jwt.verify(response.json().token)).toBeTruthy();
    });

    it("should return status 200, when email is already in use", async () => {
        await fastify.prisma.user.create({
            data: {
                name: "Joe Biden the 1st",
                email: "joe@biden.com",
                address: "",
                password: "1234",
            },
        });

        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/register",
            payload: {
                name: "Joe Biden",
                email: "joe@biden.com",
                address:
                    "1600 Pennsylvania Avenue NW, Washington, DC 20500, USA",
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "email is already in use",
            statusCode: 400,
        });
    });

    it("should return status 400, when email is invalid", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/register",
            payload: {
                name: "Joe Biden",
                email: "joebiden.com",
                address:
                    "1600 Pennsylvania Avenue NW, Washington, DC 20500, USA",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "email is invalid",
            statusCode: 400,
        });
    });
});
