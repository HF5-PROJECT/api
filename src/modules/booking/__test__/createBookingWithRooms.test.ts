import { prisma } from "../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("POST /api/booking/rooms", () => {
    const fastify = global.fastify;

    let accessToken: string;

    beforeEach(async () => {
        await fastify.redis.flushall();
        await prisma.bookingRoom.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.room.deleteMany();
        await prisma.roomType.deleteMany();
        await prisma.floor.deleteMany();
        await prisma.hotel.deleteMany();

        ({ accessToken } = await addTestUserAndPermission(
            fastify,
            "Some permission"
        ));

        await prisma.hotel.create({
            data: {
                id: 1000,
                name: "Santa Marina Hotel",
                description: "Santa Marina Hotel is located close to the beach",
                address: "8130 Sv. Marina, Sozopol, Bulgarien",
            },
        });
        await prisma.floor.createMany({
            data: [
                {
                    id: 1000,
                    number: 1,
                    hotelId: 1000,
                },
                {
                    id: 1001,
                    number: 5,
                    hotelId: 1000,
                },
                {
                    id: 1002,
                    number: 11,
                    hotelId: 1000,
                },
            ],
        });
        await prisma.roomType.createMany({
            data: [
                {
                    id: 1000,
                    name: "Luxury room",
                    description: "Room for 1 clowns laying in one bed",
                    size: "big",
                    supportedPeople: 1,
                    price: 3822.4,
                    hotelId: 1000,
                },
                {
                    id: 1001,
                    name: "Double room",
                    description: "Room for 2 clowns laying in one bed",
                    size: "big",
                    supportedPeople: 2,
                    price: 2454.4,
                    hotelId: 1000,
                },
                {
                    id: 1002,
                    name: "Luxury double room",
                    description: "Luxury room for 2 clowns laying in one bed",
                    size: "big",
                    supportedPeople: 2,
                    price: 9999.4,
                    hotelId: 1000,
                },
            ],
        });
        await prisma.room.createMany({
            data: [
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
                    roomTypeId: 1001,
                },
                {
                    id: 1002,
                    number: 3,
                    floorId: 1001,
                    roomTypeId: 1002,
                },
                {
                    id: 1003,
                    number: 4,
                    floorId: 1001,
                    roomTypeId: 1002,
                },
                {
                    id: 1004,
                    number: 6,
                    floorId: 1002,
                    roomTypeId: 1002,
                },
                {
                    id: 1005,
                    number: 66,
                    floorId: 1002,
                    roomTypeId: 1002,
                },
            ],
        });
    });

    it("should return status 201 and create a booking", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: end.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(201);
        expect(response.json()).toEqual({
            id: response.json().id,
            start: start.toISOString(),
            end: end.toISOString(),
        });
    });

    it("should return status 400, when start is in the past", async () => {
        const today = new Date();
        const start = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 2
        );
        const end = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: end.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/start must be now or in the future",
            statusCode: 400,
        });
    });

    it("should return status 400, when start is after end", async () => {
        const end = new Date();
        const start = new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: end.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/start must be before end",
            statusCode: 400,
        });
    });

    it("should return status 400, when no start has been provided", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                end: end.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'start'",
            statusCode: 400,
        });
    });

    it("should return status 400, when start is empty", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: "",
                end: end.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: 'body/start must match format "date-time"',
            statusCode: 400,
        });
    });

    it("should return status 400, when no end has been provided", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'end'",
            statusCode: 400,
        });
    });

    it("should return status 400, when end is empty", async () => {
        const start = new Date();

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: "",
                roomTypeIds: [1000, 1001, 1002, 1002],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: 'body/end must match format "date-time"',
            statusCode: 400,
        });
    });

    it("should return status 400, when no roomTypeIds has been provided", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: end.toISOString(),
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body must have required property 'roomTypeIds'",
            statusCode: 400,
        });
    });

    it("should return status 400, when roomTypeIds is empty", async () => {
        const start = new Date();
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 1
        );

        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            headers: {
                authorization: accessToken,
            },
            payload: {
                start: start.toISOString(),
                end: end.toISOString(),
                roomTypeIds: [],
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "body/roomTypeIds must NOT have fewer than 1 items",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/api/booking/rooms",
            payload: {
                number: 1,
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
