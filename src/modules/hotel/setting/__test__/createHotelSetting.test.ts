import { User, Permission } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../../utils/testHelper";

describe("POST /api/hotel/setting", () => {
    let fastify: FastifyInstance;
    let accessToken: string;
    let accessTokenNoPermission: string

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } = await addTestUserAndPermission(fastify, 'HotelSetting Create'));
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
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 201 and create a hotelSetting", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
            payload: {
                key: 'CacheModifier',
                value: '2',
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            key: 'CacheModifier',
            value: '2',
            hotelId: 1000,
        });
    });

    it("should return status 400, when no value has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
            payload: {
                key: 'CacheModifier',
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
            method: "POST",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
            payload: {
                value: '2',
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

    it("should return status 400, when no hotel id has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
            payload: {
                key: 'CacheModifier',
                value: '2',
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
            url: "/api/hotel/setting",
            headers: {
                authorization: accessToken,
            },
            payload: {
                key: 'CacheModifier',
                value: '2',
                hotelId: ""
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
            url: "/api/hotel/setting",
            payload: {
                number: 1,
                hotelId: 1000
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
            method: "POST",
            url: "/api/hotel/setting",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                number: 1,
                hotelId: 1000
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
