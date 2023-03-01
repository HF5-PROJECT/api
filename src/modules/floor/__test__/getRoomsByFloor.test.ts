import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("GET /api/floor/:id/rooms", () => {
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
            await addTestUserAndPermission(fastify, "Floor-Rooms GetAll"));
        await prisma.room.deleteMany();
        await prisma.roomType.deleteMany();
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
        await prisma.floor.create({
            data: {
                id: 1000,
                number: 1,
                hotelId: 1000,
            },
        });
        await prisma.floor.create({
            data: {
                id: 1001,
                number: 2,
                hotelId: 1000,
            },
        });
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
        await prisma.room.create({
            data: {
                id: 1000,
                number: 1,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1001,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1002,
                number: 3,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });
        await prisma.room.create({
            data: {
                id: 1003,
                number: 1,
                floorId: 1001,
                roomTypeId: 1000,
            },
        });
    });

    it("should return status 200 and get all rooms", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000/rooms",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([
            {
                id: 1000,
                number: 1,
                floorId: 1000,
                roomTypeId: 1000,
            },
            {
                id: 1001,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
            {
                id: 1002,
                number: 3,
                floorId: 1000,
                roomTypeId: 1000,
            },
        ]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.room.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000/rooms",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });

    it("should return status 400 and return error, if no floor were found", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1003/rooms",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find floor with id: 1003",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/floor/1000/rooms",
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
            method: "GET",
            url: "/api/floor/1000/rooms",
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
