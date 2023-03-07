import { addTestUserAndPermission } from "../../../../utils/testHelper";
import { prisma } from "../../../../plugins/prisma";

describe("POST /api/room/type", () => {
    const fastify = global.fastify;

    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "RoomType Create"));
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
    });

    it("should return status 201 and create a room type", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed",
            size: "big",
            supportedPeople: 2,
            price: 2454.4,
            hotelId: 1000,
        });
    });

    it("should return status 201 and create a room type, when no description has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "Double room",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: null,
            size: "big",
            supportedPeople: 2,
            price: 2454.4,
            hotelId: 1000,
        });
    });

    it("should return status 201 and create a room type, when no size has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            name: "Double room",
            description: "Room for 2 clowns laying in one bed",
            size: null,
            supportedPeople: 2,
            price: 2454.4,
            hotelId: 1000,
        });
    });

    it("should return status 400, when no name has been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
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
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/name must NOT have fewer than 1 characters",
            statusCode: 400,
        });
    });

    it("should return status 400 when no hotel could be found", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1001,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find hotel with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 400, when supportedPeople has not been provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessToken,
            },
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                price: 2454.4,
                hotelId: 1000,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'supportedPeople'",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/room/type",
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
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
            method: "POST",
            url: "/api/room/type",
            headers: {
                authorization: accessTokenNoPermission,
            },
            payload: {
                name: "Double room",
                description: "Room for 2 clowns laying in one bed",
                size: "big",
                supportedPeople: 2,
                price: 2454.4,
                hotelId: 1000,
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
