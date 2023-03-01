import { PrismaClient, User } from "@prisma/client";
import { hashSync } from "bcrypt";
import { FastifyInstance } from "fastify";

describe("GET /api/auth/user", () => {
    let fastify: FastifyInstance;
    let prisma: PrismaClient;
    let user: User;

    beforeAll(async () => {
        fastify = global.fastify;
        prisma = global.prisma;

        await prisma.user.deleteMany();
        user = await prisma.user.create({
            data: {
                name: "Joe Biden the 1st",
                email: "joe@biden.com",
                address: "",
                password: hashSync("1234", 10),
            },
        });
    });

    it("should return status 200 and return user", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/auth/user",
            headers: {
                authorization:
                    "Bearer " +
                    fastify.jwt.sign(
                        {
                            sub: user.id,
                            permissions: [],
                            iat: Number(Date()),
                        },
                        { expiresIn: "10m" }
                    ),
            },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
            name: "Joe Biden the 1st",
            email: "joe@biden.com",
            address: "",
        });
    });

    it("should return status 401, user does not exist", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/auth/user",
            headers: {
                authorization:
                    "Bearer " +
                    fastify.jwt.sign(
                        {
                            sub: 542,
                            permissions: [],
                            iat: Number(Date()),
                        },
                        { expiresIn: "10m" }
                    ),
            },
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized",
            message: "Unauthorized",
            statusCode: 401,
        });
    });

    it("should return status 401, accessToken invalid", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/api/auth/user",
            headers: {
                authorization: "invalid_access_token!!!",
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
