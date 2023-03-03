import { prisma } from "../../plugins/prisma";
import { redis } from "../../plugins/redis";
import { idNotFound } from "./permission.errors";

export const CACHE_KEY_ROLE_PERMISSIONS_FLATTENED = "rolePermissionsFlattend";
export const CACHE_KEY_PERMISSIONS_MAP = "permissionsMap";

export async function getAllPermissions() {
    return await prisma.permission.findMany();
}

export async function getPermissionById(id: number) {
    const permission = await prisma.permission.findFirst({
        where: { id: id },
    });

    if (!permission) {
        throw idNotFound(id);
    }

    return permission;
}

export async function getPermissionNamesToIds(): Promise<Map<string, number>> {
    return new Map<string, number>(await redis.rememberJSON(CACHE_KEY_PERMISSIONS_MAP, 1800, async () => {
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
}

export async function getPermissionIdsPerRoleFlatArray(roleId: number) {
    return await redis.rememberJSON<number[]>(CACHE_KEY_ROLE_PERMISSIONS_FLATTENED + roleId, 1800, async () => {
        const permissionIdObjects = await prisma.permissionOnRole.findMany({
            where: { roleId: roleId },
            select: {
                permissionId: true,
            }
        });

        // Convert the array of objects with permissionIds into a flat array of permissionIds
        return permissionIdObjects.map(permissionIdObject => {
            return permissionIdObject.permissionId;
        });
    });
}