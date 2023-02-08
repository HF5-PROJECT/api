import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { hashSync } from "bcrypt";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/auth/login", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();

        await prisma.user.deleteMany();
        await prisma.user.create({
            data: {
                name: "Joe Biden the 1st",
                email: "joe@biden.com",
                address: "",
                password: hashSync("1234", 10),
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and token", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {
                email: "joe@biden.com",
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(fastify.jwt.verify(response.json().accessToken)).toBeTruthy();
    });

    it("should return status 401, when password is incorrect", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {
                email: "joe@biden.com",
                password: "wrong password",
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "email and/or password incorrect",
            statusCode: 401,
        });
    });

    it("should return status 401, when no user has email", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {
                email: "hunter@biden.com",
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "email and/or password incorrect",
            statusCode: 401,
        });
    });

    it("should return status 400, when no email or password has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {},
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'email'",
            statusCode: 400,
        });
    });

    it("should return status 400, when no email has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {
                password: "1234",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'email'",
            statusCode: 400,
        });
    });

    it("should return status 400, when no password has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/login",
            payload: {
                email: "joe@biden.com",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'password'",
            statusCode: 400,
        });
    });
});