import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("GET /api/floor/:id/rooms", () => {
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
                hotelId: 1000
            },
        });
        await prisma.roomType.create({
            data: {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotelId: 1000
            },
        });
        await prisma.roomType.create({
            data: {
                id: 1001,
                name: "Single room",
                description: "Room for 1 clown laying in one bed",
                size: 'small',
                price: 1454.4,
                hotelId: 1000
            },
        });
        await prisma.room.create({
            data: {
                id: 1000,
                number: 1,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1001,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1002,
                number: 3,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1003,
                number: 4,
                floorId: 1000,
                roomTypeId: 1001,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all rooms", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/room/type/1000/rooms"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            number: 1,
            floorId: 1000,
            roomTypeId: 1000,
        }, {
            id: 1001,
            number: 2,
            floorId: 1000,
            roomTypeId: 1000,
        }, {
            id: 1002,
            number: 3,
            floorId: 1000,
            roomTypeId: 1000,
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.room.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/room/type/1000/rooms"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });

    it("should return status 400 and return error, if no floor were found", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/room/type/1003/rooms"
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find room type with id: 1003",
            statusCode: 400,
        });
    });
});
