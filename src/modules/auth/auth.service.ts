import { FastifyJWT, JWT } from "@fastify/jwt";
import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import { prisma } from "../../plugins/prisma";
import { CreateUserInput } from "./auth.schema";
import { getPermissionIdsPerRoleFlatArray, getPermissionNamesToIds } from "../permission/permission.service";

export async function createUser(input: CreateUserInput) {
    if (await getUserByEmail(input.email)) {
        throw Error("Email is already in use");
    }

    return await prisma.user.create({
        data: {
            email: input.email,
            password: hashSync(input.password, 10),
            name: input.name,
            address: input.address,
        },
    });
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findFirst({
        where: { email: email },
    });
}

export async function getUserById(id: number) {
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
    const userRoles = await prisma.user.findFirst({
        select: {
            roles: true,
        },
        where: { id: user.id },
    });

    if (userRoles === null) {
        // Shouldn't happen
        throw new Error('User does not exist')
    }

    let permissionIds: number[] = [];
    userRoles.roles.forEach(async (roleOnUser) => {
        // Get an array of permissionIds that this role has.
        const rolePermissionId = await getPermissionIdsPerRoleFlatArray(roleOnUser.roleId);

        // Merge this roles permissionIds with the other roles permissionIds, removing dublicates
        permissionIds = [...new Set([...permissionIds, ...rolePermissionId])];
    });

    return permissionIds;
}

export async function userHasPermission(userToken: FastifyJWT['user'], permissionName: string) {
    // Get a Map where key is permission.name and value is permission.id
    const permissionsNameToId = await getPermissionNamesToIds();

    // PermissionId for this permissionName
    const permissionId = permissionsNameToId.get(permissionName);

    if (!permissionId) {
        throw new Error('Permission does not exist')
    }

    if (!userToken.permissions.includes(permissionId)) {
        throw new Error('User does not have the required permissions')
    }
}
