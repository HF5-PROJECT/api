import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUserById } from "./auth.service";
import { CreateUserInput, LoginInput } from "./auth.schema";
import { compareSync } from "bcrypt";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>,
    reply: FastifyReply
) {
    try {
        const user = await createUser(request.body);

        reply.code(201).send(user);
    } catch (e) {
        let message = String(e);

        if (e instanceof Error) {
            message = e.message;
        }

        return reply.badRequest(message);
    }
}

export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginInput;
    }>,
    reply: FastifyReply
) {
    const user = await findUserByEmail(request.body.email);

    if (!user || !compareSync(request.body.password, user.password)) {
        return reply.unauthorized("email and/or password incorrect");
    }

    reply
        .code(200)
        .setCookie(
            "refreshToken",
            request.jwt.sign(
                {
                    sub: user.id,
                    iat: Date(),
                },
                { expiresIn: "1d" }
            ),
            {
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: true,
            }
        )
        .send({
            accessToken: request.jwt.sign(
                {
                    sub: user.id,
                    iat: Date(),
                },
                { expiresIn: "10m" }
            ),
        });
}

export async function refreshHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const payload = await request.jwtVerify<{
            sub: number;
            iat: number;
            exp: number;
        }>({ onlyCookie: true });

        const user = await findUserById(payload.sub);

        if (!user) {
            return reply.unauthorized();
        }

        reply
            .code(200)
            .setCookie(
                "refreshToken",
                request.jwt.sign(
                    {
                        sub: user.id,
                        iat: Date(),
                    },
                    { expiresIn: "1d" }
                ),
                {
                    path: "/",
                    secure: true,
                    httpOnly: true,
                    sameSite: true,
                }
            )
            .send({
                accessToken: request.jwt.sign(
                    {
                        sub: user.id,
                        iat: Date(),
                    },
                    { expiresIn: "10m" }
                ),
            });
    } catch (err) {
        reply.unauthorized();
    }
}
