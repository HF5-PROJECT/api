import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("DELETE /api/hotel/:id", () => {
    let fastify: FastifyInstance;
    let prisma: PrismaClient;
    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeAll(async () => {
        fastify = global.fastify;
        prisma = global.prisma;
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "Hotel Delete"));
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

    it("should return status 204 and delete a hotel", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
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

    it("should return status 204 and delete a hotel and its relations", async () => {
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

        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(204);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Santa Marina Hotel",
            description: "Santa Marina Hotel is located close to the beach",
            address: "8130 Sv. Marina, Sozopol, Bulgarien",
        });

        const countHotels = await prisma.hotel.count();
        expect(countHotels).toBe(0);
        const countRoomTypes = await prisma.roomType.count();
        expect(countRoomTypes).toBe(0);
    });

    it("should return status 400 and throw error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1001",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1000",
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "Unauthorized",
            statusCode: 401,
        });
    });

    it("should return status 401 when user does not have permission", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/hotel/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "Unauthorized",
            statusCode: 401,
        });
    });
});
