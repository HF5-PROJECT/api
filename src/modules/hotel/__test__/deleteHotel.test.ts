import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("DELETE /api/hotel/:id", () => {
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

    it("should return status 204 and delete a hotel", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1000"
        });

        expect(response.statusCode).toBe(204);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Santa Marina Hotel",
            description: "Santa Marina Hotel is located close to the beach",
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        });
        
        const count = await prisma.hotel.count();
        expect(count).toBe(0);
    });

    it("should return status 400 and throw error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1001"
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });
});
