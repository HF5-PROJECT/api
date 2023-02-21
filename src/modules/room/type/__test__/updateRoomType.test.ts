import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("POST /api/room/type", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.roomType.deleteMany();
        await prisma.hotel.deleteMany();
        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
            },
        });
        await prisma.roomType.create({
            data: {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and update a room type", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed, having fun",
                size: 'big',
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed, having fun",
            size: 'big',
            price: 2454.4,
            hotel_id: 1000
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1001",
            payload: {
                id: 1001,
                name: "Single room",
                description: "Room for 1 clowns laying in one bed",
                size: 'small',
                price: 1454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find room type with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 200 and update a room type, if no new description is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Double room",
                size: 'very big',
                price: 2454.4,
                hotel_id: 1000
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed",
            size: 'very big',
            price: 2454.4,
            hotel_id: 1000
        });
    });

    it("should return status 400, when no name has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                description: "Room for 2 clowns laying in one bed, having fun",
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
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "",
                description: "Room for 2 clowns laying in one bed, having fun",
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
