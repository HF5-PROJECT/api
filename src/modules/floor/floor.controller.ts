import { FastifyReply, FastifyRequest } from "fastify";
import {
    createFloor,
    browseFloor,
    showFloor,
    updateFloor,
    deleteFloor
} from "./floor.service";
import {
    CreateFloorInput,
    UpdateFloorInput,
    ShowFloorParams,
    DeleteFloorParams
} from "./floor.schema";
import { error_message } from "./floor.errors";
import { Floor } from "@prisma/client";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_FLOORS = "allFloors";
const CACHE_KEY_FLOOR = "floor";

export async function createFloorHandler(
    request: FastifyRequest<{
        Body: CreateFloorInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_FLOORS);
        const floor = await createFloor(request.body);

        reply.code(201).send(floor);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function browseFloorHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const floors = await request.redis.rememberJSON<Floor[]>(CACHE_KEY_FLOORS, CACHE_TTL, async () => {
            return await browseFloor();
        });

        reply.code(200).send(floors);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function showFloorHandler(
    request: FastifyRequest<{
        Params: ShowFloorParams;
    }>,
    reply: FastifyReply
) {
    try {
        const floor = await request.redis.rememberJSON<Floor>(CACHE_KEY_FLOOR+request.params.id, CACHE_TTL, async () => {
            return await showFloor(Number(request.params.id));
        });

        reply.code(200).send(floor);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function updateFloorHandler(
    request: FastifyRequest<{
        Body: UpdateFloorInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_FLOOR+request.body.id, CACHE_KEY_FLOORS);
        const floor = await updateFloor(request.body);

        reply.code(200).send(floor);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function deleteFloorHandler(
    request: FastifyRequest<{
        Params: DeleteFloorParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_FLOOR+request.params.id, CACHE_KEY_FLOORS);
        const floor = await deleteFloor(Number(request.params.id));

        reply.code(204).send(floor);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}