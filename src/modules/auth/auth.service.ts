import { FastifyJWT, JWT } from "@fastify/jwt";
import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import { prisma } from "../../plugins/prisma";
import { redis } from "../../plugins/redis";
import { CreateUserInput } from "./auth.schema";

export const CACHE_KEY_ROLE_PERMISSIONS_FLATTENED = "rolePermissionsFlattend";
export const CACHE_KEY_PERMISSIONS_MAP = "permissionsMap";

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
        const rolePermissionId = await redis.rememberJSON<number[]>(CACHE_KEY_ROLE_PERMISSIONS_FLATTENED + roleOnUser.roleId, 1800, async () => {
            const permissionIdObjects = await prisma.permissionOnRole.findMany({
                where: { roleId: roleOnUser.roleId },
                select: {
                    permissionId: true,
                }
            });

            // Convert the array of objects with permissionIds into a flat array of permissionIds
            return permissionIdObjects.map(permissionIdObject => {
                return permissionIdObject.permissionId;
            });
        });

        // Merge this roles permissionIds with the other roles permissionIds, removing dublicates
        permissionIds = [...new Set([...permissionIds, ...rolePermissionId])];
    });

    return permissionIds;
}

export async function userHasPermission(userToken: FastifyJWT['user'], permissionName: string) {
    // Get a Map where key is permission.name and value is permission.id
    const permissionsNameToId = new Map<string, number>(await redis.rememberJSON(CACHE_KEY_PERMISSIONS_MAP, 1800, async () => {
        // Get all permissions
        const permissions = await prisma.permission.findMany();

        // Convert array of permissions to Map<permission.name, permission.id>
        const permissionsNameToId = new Map<string, number>();
        permissions.forEach((permission) => {
            permissionsNameToId.set(permission.name, permission.id);
        });

        // Return Map as an [string, number][] as map can't be converted to JSON
        return Array.from(permissionsNameToId.entries());
    }));

    // PermissionId for this permissionName
    const permissionId = permissionsNameToId.get(permissionName);

    if (!permissionId) {
        throw new Error('Permission does not exist')
    }

    if (!userToken.permissions.includes(permissionId)) {
        throw new Error('User does not have the required permissions')
    }
}