import { prisma } from "../../../plugins/prisma";
import { addTestUserAndPermission } from "../../../utils/testHelper";

describe("DELETE /api/floor/:id", () => {
    const fastify = global.fastify;

    let accessToken: string;
    let accessTokenNoPermission: string;

    beforeEach(async () => {
        await fastify.redis.flushall();
        ({ accessToken, accessTokenNoPermission } =
            await addTestUserAndPermission(fastify, "Floor Delete"));
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
    });

    it("should return status 204 and delete a floor", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/floor/1000",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(204);
        expect(response.json()).toEqual({
            id: 1000,
            number: 1,
            hotelId: 1000,
        });

        const count = await prisma.floor.count();
        expect(count).toBe(0);
    });

    it("should return status 400 and throw error, if none was found by id", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/floor/1001",
            headers: {
                authorization: accessToken,
            },
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toEqual({
            error: "Bad Request",
            message: "Could not find floor with id: 1001",
            statusCode: 400,
        });
    });

    it("should return status 401 when no user is provided", async () => {
        const response = await fastify.inject({
            method: "DELETE",
            url: "/api/floor/1000",
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
            url: "/api/floor/1000",
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
