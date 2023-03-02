import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("GET /api/hotel/information/:id", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        await prisma.hotelInformation.deleteMany();
        await prisma.hotel.deleteMany();
        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
            },
        });
        await prisma.hotelInformation.create({
            data: {
                id: 1000,
                key: 'Opening Hours',
                value: '06:00 - 24:00',
                hotelId: 1000,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get hotelInformation by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/information/1000",
            payload: {
                id: 1000
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            key: 'Opening Hours',
            value: '06:00 - 24:00',
            hotelId: 1000,
        });
    });

    it("should return status 400 and return error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/information/1001",
            payload: {
                id: 1001
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel information with id: 1001",
            statusCode: 400,
        });
    });
});
