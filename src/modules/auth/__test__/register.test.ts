import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/auth/register", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
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

        expect(response.statusCode).toBe(201);
        // TODO: Verify that created user is return
    });

    it("should return status 200, when email is already in use", async () => {
        await prisma.user.create({
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
            message: "Email is already in use",
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
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: 'body/email must match format "email"',
            statusCode: 400,
        });
    });
});
