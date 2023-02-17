import { FastifyInstance } from "fastify";
import { build } from "../../../index";
import { hashSync } from "bcrypt";
import { prisma } from "../../../plugins/prisma";

describe("POST /api/auth/logout", () => {
    let fastify: FastifyInstance;

    beforeAll(async () => {
        fastify = await build();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await fastify.close();
    });

    it("should return status 200 and clear the refreshToken", async () => {
        const user = await prisma.user.create({
            data: {
                name: "Joe Biden the 1st",
                email: "joe@biden.com",
                address: "",
                password: hashSync("1234", 10),
            },
        });

        const response = await fastify.inject({
            method: "POST",
            url: "/api/auth/logout",
            payload: {},
            cookies: {
                refreshToken: fastify.jwt.sign(
                    {
                        sub: user.id,
                        iat: Date(),
                    },
                    { expiresIn: "1d" }
                ),
            },
        });

        const refreshToken: any = response.cookies[0];

        expect(response.statusCode).toBe(200);
        expect(refreshToken.value).toBe("");
    });
});
