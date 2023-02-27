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

// TODO: REWRITE OR COMMENT IDK
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

    let permissionIds: number[] = [];
    userAndRoles.roles.forEach(async (roleOnUser) => {
        const permissionIdObjects = await prisma.permissionOnRole.findMany({
            where: { roleId: roleOnUser.roleId },
            select: {
                permissionId: true,
            }
        });

        const permissionIdFlattened = permissionIdObjects.map(permissionIdObject => {
            return permissionIdObject.permissionId;
        });

        permissionIds = [...new Set([...permissionIds, ...permissionIdFlattened])];
    });

    return permissionIds;
}

export async function userHasPermission(userToken: FastifyJWT['user'], permissionName: string) {
    const permissionsNameToId = await getPermissionNamesMappedToIds();

    const permissionId = permissionsNameToId.get(permissionName);

    if (!permissionId) {
        throw new Error('Permission does not exist')
    }

    if (!userToken.permissions.includes(permissionId)) {
        throw new Error('User does not have the required permissions')
    }

    // TODO: CACHE
    async function getPermissionNamesMappedToIds(): Promise<Map<string, number>> {
        const permissions = await prisma.permission.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        const permissionsNameToId = new Map<string, number>();
        permissions.forEach((permission) => {
            permissionsNameToId.set(permission.name, permission.id);
        });
        return permissionsNameToId;
    }
}