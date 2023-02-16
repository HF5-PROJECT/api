import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("GET /api/hotel", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.hotel.deleteMany();
        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
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
        await prisma.hotel.create({
            data: {
                id: 1002,
                name: "WakeUp Copenhagen",
                description: "WakeUp Copenhagen is placed in Denmark",
                address: "Carsten Niebuhrs Gade 11, 1577 København",
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all hotels", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            name: "Santa Marina Hotel",
            description: "Santa Marina Hotel is located close to the beach",
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        },{
            id: 1001,
            name: "Luis de Morocco",
            description: "El hotel en Morocco esta cerca de la playa",
            address: "420 B., Morocco Calle",
        },{
            id: 1002,
            name: "WakeUp Copenhagen",
            description: "WakeUp Copenhagen is placed in Denmark",
            address: "Carsten Niebuhrs Gade 11, 1577 København",
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.hotel.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/hotel"
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });
});
