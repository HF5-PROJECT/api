import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("PUT /api/floor", () => {
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
            await addTestUserAndPermission(fastify, "Floor Update"));
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
        await prisma.floor.create({
            data: {
                id: 1000,
                number: 1,
                hotelId: 1000,
            },
        });
    });

    it("should return status 200 and update a floor", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 2,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            number: 2,
            hotelId: 1000,
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/floor/1001",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1001,
                number: 2,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find floor with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 400, when no number has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
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
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
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

    it("should return status 400, if no hotel id is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
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

    it("should return status 400, if hotel id is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
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
            method: "PUT",
            url: "/api/floor/1000",
            payload: {
                id: 1000,
                number: 2,
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
            method: "PUT",
            url: "/api/floor/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                id: 1000,
                number: 2,
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
