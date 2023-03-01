import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("POST /api/floor", () => {
    let fastify: FastifyInstance;
    let prisma: PrismaClient;

    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeAll(async () => {
        fastify = global.fastify;
        prisma = global.prisma;
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "Floor Create"));
        await prisma.floor.deleteMany();
        await prisma.hotel.deleteMany();
        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
            },
        });
    });

    it("should return status 201 and create a floor", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
            payload: {
                number: 1,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            number: 1,
            hotelId: 1000,
        });
    });

    it("should return status 400, when no number has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
            payload: {
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'number'",
            statusCode: 400,
        });
    });

    it("should return status 400, when number is empty", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
            payload: {
                number: "",
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/number must be number",
            statusCode: 400,
        });
    });

    it("should return status 400, when no hotel id has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
            payload: {
                number: 1,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'hotelId'",
            statusCode: 400,
        });
    });

    it("should return status 400, when hotelId is empty", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
            payload: {
                number: 1,
                hotelId: "",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/hotelId must be number",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            payload: {
                number: 1,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "Unauthorized",
            statusCode: 401,
        });
    });

    it("should return status 401 when user does not have permission", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                number: 1,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "Unauthorized",
            statusCode: 401,
        });
    });
});
