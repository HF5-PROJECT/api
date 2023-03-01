import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("GET /api/floor/:id", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'Floor Get'));
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
                hotelId: 1000
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get floor by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            number: 1,
            hotelId: 1000
        });
    });

    it("should return status 400 and return error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1001",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1001
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find floor with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000",
            payload: {
                id: 1000
            }
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            "error": "Unauthorized",
            "message": "Unauthorized",
            "statusCode": 401,
        });
    });

    it("should return status 401 when user does not have permission", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                id: 1000
            }
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            "error": "Unauthorized",
            "message": "Unauthorized",
            "statusCode": 401,
        });
    });
});
