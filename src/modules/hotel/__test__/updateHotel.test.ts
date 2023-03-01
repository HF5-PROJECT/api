import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("PUT /api/hotel", () => {
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
            await addTestUserAndPermission(fastify, "Hotel Update"));
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

    it("should return status 200 and update a hotel", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Luis de Morocco",
            description: "El hotel en Morocco esta cerca de la playa",
            address: "420 B., Morocco Calle",
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1001",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1001,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 200 and update a hotel, if no new description is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Luis de Morocco",
            description: "Santa Marina Hotel is located close to the beach",
            address: "420 B., Morocco Calle",
        });
    });

    it("should return status 400, when no address has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'address'",
            statusCode: 400,
        });
    });

    it("should return status 400, when address is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/address must NOT have fewer than 1 characters",
            statusCode: 400,
        });
    });

    it("should return status 400, when no name has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'name'",
            statusCode: 400,
        });
    });

    it("should return status 400, when name is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                name: "",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/name must NOT have fewer than 1 characters",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/1000",
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
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
            url: "/api/hotel/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
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
