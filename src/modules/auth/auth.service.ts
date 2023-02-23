import { FastifyJWT, JWT } from "@fastify/jwt";
import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import fastify from "fastify";
import { prisma } from "../../plugins/prisma";
import { CreateUserInput } from "./auth.schema";

export async function createUser(input: CreateUserInput) {
    if (await findUserByEmail(input.email)) {
        throw Error("Email is already in use");
    }

    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: hashSync(input.password, 10),
            name: input.name,
            address: input.address,
        },
    });

    return user;
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findFirst({
        where: { email: email },
    });
}

export async function findUserById(id: number) {
    return await prisma.user.findFirst({
        where: { id: id },
    });
}

export async function createRefreshToken(user: User, jwt: JWT) {
    return jwt.sign(
        {
            sub: user.id,
            permissions: [],
            iat: Number(Date()),
        },
        { expiresIn: "14d" }
    );
}

export async function createAccessToken(user: User, jwt: JWT) {
    const permissionIds = await getUserPermissionIds(user);

    return jwt.sign(
        {
            sub: user.id,
            permissions: permissionIds,
            iat: Number(Date()),
        },
        { expiresIn: "10m" }
    );
}

async function getUserPermissionIds(user: User): Promise<number[]> {
    const userAndRoles = await prisma.user.findFirst({
        where: { id: user.id },
        include: {
            roles: true,
        },
    });

    if (userAndRoles === null) {
        return [];
    }

    const permissionIds: number[] = [];
    userAndRoles.roles.forEach(async (roleOnUser) => {
        const permissionIdObjects = await prisma.permissionOnRole.findMany({
            where: { roleId: roleOnUser.roleId },
            select: {
                permissionId: true,
            }
        });

        permissionIds.concat(permissionIdObjects.map(permissionIdObject => {
            return permissionIdObject.permissionId;
        }));
    });

    return permissionIds;
}

export async function userHasPermission(user: FastifyJWT['user'], permissionName: string) {

}
