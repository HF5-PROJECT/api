import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { prisma } from "../../../plugins/prisma";

describe("GET /api/permission", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await fastify.redis.flushall();
        await prisma.permission.deleteMany();
        await prisma.permission.create({
            data: {
                id: 1000,
                name: 'Floor Create',
            },
        });
        await prisma.permission.create({
            data: {
                id: 1001,
                name: 'Floor Update',
            },
        });
        await prisma.permission.create({
            data: {
                id: 1002,
                name: 'Hotel Create',
            },
        });
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and get all floors", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/permission",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([{
            id: 1000,
            name: 'Floor Create',
        }, {
            id: 1001,
            name: 'Floor Update',
        }, {
            id: 1002,
            name: 'Hotel Create',
        }]);
    });

    it("should return status 200 and return empty, if none were found", async () => {
        await prisma.permission.deleteMany();
        const response = await fastify.inject({
            method: "GET",
            url: "/api/permission",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual([]);
    });
});
