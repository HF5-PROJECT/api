import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../../utils/testHelper";

describe("GET /api/hotel/setting", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'HotelSetting GetAll'));
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
                key: 'MaxAllowedInstances',
                value: '4',
                hotelId: 1000,
            },
        });
        await prisma.hotelSetting.create({
            data: {
                id: 1001,
                key: 'CacheModifier',
                value: '2',
                hotelId: 1000,
            },
        });
        await prisma.hotelSetting.create({
            data: {
                id: 1002,
                key: 'StaticSearch',
                value: 'FALSE',
                hotelId: 1000,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all hotelSetting", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            key: 'MaxAllowedInstances',
            value: '4',
            hotelId: 1000,
        }, {
            id: 1001,
            key: 'CacheModifier',
            value: '2',
            hotelId: 1000,
        }, {
            id: 1002,
            key: 'StaticSearch',
            value: 'FALSE',
            hotelId: 1000,
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.hotelSetting.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/setting",
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
            url: "/api/hotel/setting",
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
            url: "/api/hotel/setting",
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
