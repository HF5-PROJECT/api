import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("POST /api/room/type", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.hotel.deleteMany();
        await prisma.roomType.deleteMany();
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

    it("should return status 201 and create a room type", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed",
            size: 'big',
            price: 2454.4,
            hotel_id: 1000
        });
    });

    it("should return status 201 and create a room type, when no description has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            payload: {
                name: "Double room",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: null,
            size: 'big',
            price: 2454.4,
            hotel_id: 1000
        });
    });

    it("should return status 201 and create a room type, when no size has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed",
            size: null,
            price: 2454.4,
            hotel_id: 1000
        });
    });

    it("should return status 400, when no name has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            payload: {
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
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
            method: "POST",
            url: "/api/room/type",
            payload: {
                name: "",
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/name must NOT have fewer than 1 characters",
            statusCode: 400,
        });
    });
});
