import { addTestUserAndPermission } from "../../../utils/testHelper";
import { prisma } from "../../../plugins/prisma";

describe("PUT /api/room", () => {
    const fastify = global.fastify;

    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "Room Update"));
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
    });

    it("should return status 200 and update a room", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            id: 1000,
            number: 2,
            floorId: 1000,
            roomTypeId: 1000,
        });
    });

    it("should return status 400, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1001",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1001,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find room with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 400, when no number has been provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'number'",
            statusCode: 400,
        });
    });

    it("should return status 400, when number is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: "",
                floorId: 1000,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/number must be number",
            statusCode: 400,
        });
    });

    it("should return status 400, if no floor id is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 1,
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'floorId'",
            statusCode: 400,
        });
    });

    it("should return status 400, if floor id is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 1,
                floorId: "",
                roomTypeId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/floorId must be number",
            statusCode: 400,
        });
    });

    it("should return status 400, if no room id is sent", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 1,
                floorId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'roomTypeId'",
            statusCode: 400,
        });
    });

    it("should return status 400, if room id is empty", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessToken,
            },
            payload: {
                id: 1000,
                number: 1,
                floorId: 1000,
                roomTypeId: "",
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/roomTypeId must be number",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "PUT",
            url: "/api/room/1000",
            payload: {
                id: 1000,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
            },
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
            method: "PUT",
            url: "/api/room/1000",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                id: 1000,
                number: 2,
                floorId: 1000,
                roomTypeId: 1000,
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
