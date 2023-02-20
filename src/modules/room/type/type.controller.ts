import { FastifyReply, FastifyRequest } from "fastify";
import {
    createRoomType,
    browseRoomType,
    showRoomType,
    updateRoomType,
    deleteRoomType
} from "./type.service";
import {
    CreateRoomTypeInput,
    UpdateRoomTypeInput,
    ShowRoomTypeParams,
    DeleteRoomTypeParams
} from "./type.schema";
import { error_message } from "./type.errors";
import { RoomType } from "@prisma/client";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_ROOM_TYPES = "allRoomTypes";
const CACHE_KEY_ROOM_TYPE = "RoomType";

export async function createRoomTypeHandler(
    request: FastifyRequest<{
        Body: CreateRoomTypeInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_ROOM_TYPES);
        const RoomType = await createRoomType(request.body);

        reply.code(201).send(RoomType);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function browseRoomTypeHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const RoomTypes = await request.redis.rememberJSON<RoomType[]>(CACHE_KEY_ROOM_TYPES, CACHE_TTL, async () => {
            return await browseRoomType();
        });

        reply.code(200).send(RoomTypes);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function showRoomTypeHandler(
    request: FastifyRequest<{
        Params: ShowRoomTypeParams;
    }>,
    reply: FastifyReply
) {
    try {
        const RoomType = await request.redis.rememberJSON<RoomType>(CACHE_KEY_ROOM_TYPE+request.params.id, CACHE_TTL, async () => {
            return await showRoomType(Number(request.params.id));
        });

        reply.code(200).send(RoomType);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function updateRoomTypeHandler(
    request: FastifyRequest<{
        Body: UpdateRoomTypeInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_ROOM_TYPE+request.body.id, CACHE_KEY_ROOM_TYPES);
        const RoomType = await updateRoomType(request.body);

        reply.code(200).send(RoomType);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function deleteRoomTypeHandler(
    request: FastifyRequest<{
        Params: DeleteRoomTypeParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_ROOM_TYPE+request.params.id, CACHE_KEY_ROOM_TYPES);
        const RoomType = await deleteRoomType(Number(request.params.id));

        reply.code(204).send(RoomType);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}