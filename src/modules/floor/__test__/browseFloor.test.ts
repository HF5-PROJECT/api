import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("GET /api/floor", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        await prisma.floor.deleteMany();
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
        await prisma.floor.create({
            data: {
                id: 1000,
                number: 1,
                hotelId: 1000
            },
        });
        await prisma.floor.create({
            data: {
                id: 1001,
                number: 2,
                hotelId: 1000
            },
        });
        await prisma.floor.create({
            data: {
                id: 1002,
                number: 3,
                hotelId: 1000
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all floors", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            number: 1,
            hotelId: 1000
        },{
            id: 1001,
            number: 2,
            hotelId: 1000
        },{
            id: 1002,
            number: 3,
            hotelId: 1000
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.floor.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });
});
