import { addTestUserAndPermission } from "../../../utils/testHelper";
import { prisma } from "../../../plugins/prisma";

describe("GET /api/floor", () => {
    const fastify = global.fastify;

    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "Floor GetAll"));
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
        await prisma.floor.create({
            data: {
                id: 1001,
                number: 2,
                hotelId: 1000,
            },
        });
        await prisma.floor.create({
            data: {
                id: 1002,
                number: 3,
                hotelId: 1000,
            },
        });
    });

    it("should return status 200 and get all floors", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([
            {
                id: 1000,
                number: 1,
                hotelId: 1000,
            },
            {
                id: 1001,
                number: 2,
                hotelId: 1000,
            },
            {
                id: 1002,
                number: 3,
                hotelId: 1000,
            },
        ]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.floor.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor",
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
            method: "GET",
            url: "/api/floor",
            headers: {
                authorization: accessTokenNoPermission,
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
