import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("GET /api/hotel/:id/settings", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'Hotel-HotelSettings GetAll'));
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
        await prisma.hotel.create({
            data: {
                id: 1001,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
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
                hotelId: 1001,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all hotelSettings", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1000/settings",
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
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.hotelSetting.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1000/settings",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });

    it("should return status 400 and return error, if no hotel were found", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1003/settings",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1003",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1000/settings",
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
            url: "/api/hotel/1000/settings",
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
