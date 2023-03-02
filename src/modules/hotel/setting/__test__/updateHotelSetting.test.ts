import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../../utils/testHelper";

describe("PUT /api/hotel/setting", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'HotelSetting Update'));
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
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and update a hotel setting", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                value: '10000',
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            key: 'MaxAllowedInstances',
            value: '10000',
            hotelId: 1000,
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/setting/1001",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1001,
                key: 'MaxAllowedInstances',
                value: '4',
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel setting with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 400, when no value has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'value'",
            statusCode: 400,
        });
    });

    it("should return status 400, when no key has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                value: '4',
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'key'",
            statusCode: 400,
        });
    });

    it("should return status 400, if no hotel id is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                value: '4',
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
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                value: '4',
                hotelId: '',
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
            url: "/api/hotel/setting/1000",
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                value: '10000',
                hotelId: 1000,
            },
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
            method: "PUT",
            url: "/api/hotel/setting/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                id: 1000,
                key: 'MaxAllowedInstances',
                value: '10000',
                hotelId: 1000,
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
