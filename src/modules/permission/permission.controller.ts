import { FastifyReply, FastifyRequest } from "fastify";
import {
    getAllPermissions,
} from "./permission.service";
import { errorMessage } from "../../utils/string";
import { Permission } from "@prisma/client";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_PERMISSIONS = "allPermissions";
const CACHE_KEY_PERMISSION = "permission";

export async function getAllPermissionsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const permissions = await request.redis.rememberJSON<Permission[]>(
            CACHE_KEY_PERMISSIONS,
            CACHE_TTL,
            async () => {
                return await getAllPermissions();
            }
        );

        return reply.code(200).send(permissions);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}
