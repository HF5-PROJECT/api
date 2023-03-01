import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

describe("GET /api/hotel/:id", () => {
    let fastify: FastifyInstance;
    let prisma: PrismaClient;

    beforeAll(async () => {
        fastify = global.fastify;
        prisma = global.prisma;
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
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

    it("should return status 200 and get hotel by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1000",
            payload: {
                id: 1000,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Santa Marina Hotel",
            description: "Santa Marina Hotel is located close to the beach",
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        });
    });

    it("should return status 400 and return error, if none was found by id", async () => {
        await prisma.hotel.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1001",
            payload: {
                id: 1001,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });
});
