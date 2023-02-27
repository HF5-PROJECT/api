import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("GET /api/room/type", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
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
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });
        await prisma.roomType.create({
            data: {
                id: 1001,
                name: "Single room",
                description: "Room for 1 clowns laying in one bed",
                size: "small",
                supportedPeople: 1,
                price: 1454.4,
                hotelId: 1000,
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
        await prisma.roomType.create({
            data: {
                id: 1002,
                name: "Group room",
                description: "Room for 4 clowns laying in one bed",
                size: "very big",
                supportedPeople: 4,
                price: 4454.4,
                hotelId: 1001,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all room types", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/room/type",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([
            {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
            {
                id: 1001,
                name: "Single room",
                description: "Room for 1 clowns laying in one bed",
                size: "small",
                supportedPeople: 1,
                price: 1454.4,
                hotelId: 1000,
            },
            {
                id: 1002,
                name: "Group room",
                description: "Room for 4 clowns laying in one bed",
                size: "very big",
                supportedPeople: 4,
                price: 4454.4,
                hotelId: 1001,
            },
        ]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.roomType.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/room/type",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });
});
