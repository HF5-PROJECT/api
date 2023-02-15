import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/hotel/", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.hotel.deleteMany();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 201 and create a hotel", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/",
            payload: {
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address:
                    "8130 Sv. Marina, Sozopol, Bulgarien"
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Santa Marina Hotel",
            description: "Santa Marina Hotel is located close to the beach",
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        });
    });

    it("should return status 201 and create a hotel, when no description has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/",
            payload: {
                name: "Santa Marina Hotel",
                address:
                    "8130 Sv. Marina, Sozopol, Bulgarien"
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Santa Marina Hotel",
            description: null,
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        });
    });

    it("should return status 400, when no address has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/hotel/",
            payload: {
                name: "Santa Marina Hotel"
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
            method: "POST",
            url: "/api/hotel/",
            payload: {
                name: "Santa Marina Hotel",
                address: ""
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
            method: "POST",
            url: "/api/hotel/",
            payload: {
                address:
                    "8130 Sv. Marina, Sozopol, Bulgarien",
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
            method: "POST",
            url: "/api/hotel/",
            payload: {
                name: "",
                address:
                    "8130 Sv. Marina, Sozopol, Bulgarien",
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
