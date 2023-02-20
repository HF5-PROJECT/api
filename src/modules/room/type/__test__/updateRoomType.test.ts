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
        await prisma.roomType.create({
            data: {
                id: 1000,
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: 'big',
                price: 2454.4,
                hotel_id: 1
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and update a hotel", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Luis de Morocco",
            description: "El hotel en Morocco esta cerca de la playa",
            address: "420 B., Morocco Calle",
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1001",
            payload: {
                id: 1001,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 200 and update a hotel, if no new description is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                address: "420 B., Morocco Calle",
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            name: "Luis de Morocco",
            description: "Santa Marina Hotel is located close to the beach",
            address: "420 B., Morocco Calle",
        });
    });

    it("should return status 400, when no address has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'address'",
            statusCode: 400,
        });
    });

    it("should return status 400, when address is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                name: "Luis de Morocco",
                description: "El hotel en Morocco esta cerca de la playa",
                address: "",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/address must NOT have fewer than 1 characters",
            statusCode: 400,
        });
    });

    it("should return status 400, when no name has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/type/1000",
            payload: {
                id: 1000,
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
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
                description: "El hotel en Morocco esta cerca de la playa",
                address: "420 B., Morocco Calle",
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
