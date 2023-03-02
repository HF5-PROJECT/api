import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../../utils/testHelper";

describe("DELETE /api/hotel/setting/:id", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'HotelSetting Delete'));
        await prisma.hotelSetting.deleteMany();
        await prisma.hotel.deleteMany();
        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
            },
        });
        await prisma.hotelSetting.create({
            data: {
                id: 1000,
                key: 'CacheModifier',
                value: '2',
                hotelId: 1000,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 204 and delete a hotelSetting", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(204);
        expect(response.json()).toEqual({
            id: 1000,
            key: 'CacheModifier',
            value: '2',
            hotelId: 1000,
        });

        const count = await prisma.hotelSetting.count();
        expect(count).toBe(0);
    });

    it("should return status 400 and throw error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/setting/1001",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel setting with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/setting/1000",
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
            method: "DELETE",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            "error": "Unauthorized",
            "message": "Unauthorized",
            "statusCode": 401,
        });
    });
});
