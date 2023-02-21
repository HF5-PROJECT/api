import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/floor", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
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

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 201 and create a floor", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            payload: {
                number: 1,
                hotelId: 1000
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            number: 1,
            hotelId: 1000
        });
    });

    it("should return status 400, when no number has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/floor",
            payload: {
                hotelId: 1000
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
            payload: {
                number: "",
                hotelId: 1000
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
            payload: {
                number: 1,
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
});
