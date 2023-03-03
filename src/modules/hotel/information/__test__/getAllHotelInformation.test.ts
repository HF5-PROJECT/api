import { FastifyInstance } from "fastify";
import { build } from "../../../../index";
import { prisma } from "../../../../plugins/prisma";

describe("GET /api/hotel/information", () => {
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
        await prisma.hotelInformation.create({
            data: {
                id: 1001,
                key: 'Breakfast',
                value: '07:00 - 11:00',
                hotelId: 1000,
            },
        });
        await prisma.hotelInformation.create({
            data: {
                id: 1002,
                key: 'Wifi Password',
                value: 'overnites-is-cool',
                hotelId: 1000,
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all hotelInformation", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/information",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            key: 'Opening Hours',
            value: '06:00 - 24:00',
            hotelId: 1000,
        }, {
            id: 1001,
            key: 'Breakfast',
            value: '07:00 - 11:00',
            hotelId: 1000,
        }, {
            id: 1002,
            key: 'Wifi Password',
            value: 'overnites-is-cool',
            hotelId: 1000,
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.hotelInformation.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/information",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });
});
