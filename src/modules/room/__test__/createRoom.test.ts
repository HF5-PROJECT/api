import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/room", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        await prisma.room.deleteMany();
        await prisma.roomType.deleteMany();
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
        await prisma.roomType.create({
            data: {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 201 and create a room", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                number: 1,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            number: 1,
            floorId: 1000,
            roomTypeId: 1000,
        });
    });

    it("should return status 400, when no number has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                floorId: 1000,
                roomTypeId: 1000,
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
            url: "/api/room",
            payload: {
                number: "",
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/number must be number",
            statusCode: 400,
        });
    });

    it("should return status 400, when no roomTypeId id has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                number: 1,
                floorId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'roomTypeId'",
            statusCode: 400,
        });
    });

    it("should return status 400, when no floor id has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                number: 1,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'floorId'",
            statusCode: 400,
        });
    });

    it("should return status 400, when floorId is empty", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                number: 1,
                floorId: "",
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/floorId must be number",
            statusCode: 400,
        });
    });

    it("should return status 400, when roomTypeId is empty", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room",
            payload: {
                number: 1,
                floorId: 1000,
                roomTypeId: "",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/roomTypeId must be number",
            statusCode: 400,
        });
    });
});
