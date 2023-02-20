import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

const CACHE_KEY_HOTEL = "hotel";

describe("GET /api/hotel/:id", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.del(CACHE_KEY_HOTEL+"1000");
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

    it("should return status 200 and get hotel by id", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel/1000",
            payload: {
                id: 1000
            }
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
                id: 1001
            }
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });
});
