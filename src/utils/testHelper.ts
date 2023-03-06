import { Permission, User } from "@prisma/client";
import { FastifyInstance } from "fastify/types/instance";
import { prisma as p } from "../plugins/prisma";

export async function addTestUserAndPermission(
    fastify: FastifyInstance,
    permissionName: string
): Promise<{
    user: User;
    accessToken: string;
    accessTokenNoPermission: string;
    permission: Permission;
}> {
    const prisma = p ?? global.prisma;

    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.user.deleteMany();

    const permission = await prisma.permission.create({
        data: {
            name: permissionName,
        },
    });

    const role = await prisma.role.create({
        data: {
            name: permissionName + " Role",
            permissions: {
                create: {
                    permission: {
                        connect: { id: permission.id },
                    },
                },
            },
        },
    });

    const user = await prisma.user.create({
        data: {
            name: "Joe Biden the 1st",
            email: "joe@biden.com",
            address: "",
            password:
                "$2b$10$4cYGVnrLrgbuU5gIiCHE1OhBcwDJATdzBfe9yj5rIFXrH52J8.m9C", // 12345678
            roles: {
                create: {
                    role: {
                        connect: { id: role.id },
                    },
                },
            },
        },
    });

    return {
        user: user,
        accessToken:
            "Bearer " +
            fastify.jwt.sign(
                {
                    sub: user.id,
                    permissions: [permission.id],
                    iat: Number(Date()),
                },
                { expiresIn: "10m" }
            ),
        accessTokenNoPermission:
            "Bearer " +
            fastify.jwt.sign(
                {
                    sub: user.id,
                    permissions: [],
                    iat: Number(Date()),
                },
                { expiresIn: "10m" }
            ),
        permission: permission,
    };
}
