import { FastifyReply, FastifyRequest } from "fastify";
import {
    createRoom,
    browseRoom,
    showRoom,
    updateRoom,
    deleteRoom
} from "./room.service";
import {
    CreateRoomInput,
    UpdateRoomInput,
    ShowRoomParams,
    DeleteRoomParams
} from "./room.schema";
import { errorMessage } from "./room.errors";
import { Room } from "@prisma/client";
import { CACHE_KEY_FLOOR_ROOMS } from "../floor/floor.controller";
import { CACHE_KEY_ROOM_TYPE_ROOMS } from "./type/type.controller";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_ROOMS = "allRooms";
const CACHE_KEY_ROOM = "room";

export async function createRoomHandler(
    request: FastifyRequest<{
        Body: CreateRoomInput;
    }>,
    reply: FastifyReply
) {
    try {
        const room = await createRoom(request.body);
        await request.redis.invalidateCaches(CACHE_KEY_ROOMS, CACHE_KEY_FLOOR_ROOMS + room.floorId, CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId);

        reply.code(201).send(room);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function browseRoomHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const rooms = await request.redis.rememberJSON<Room[]>(CACHE_KEY_ROOMS, CACHE_TTL, async () => {
            return await browseRoom();
        });

        reply.code(200).send(rooms);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function showRoomHandler(
    request: FastifyRequest<{
        Params: ShowRoomParams;
    }>,
    reply: FastifyReply
) {
    try {
        const room = await request.redis.rememberJSON<Room>(CACHE_KEY_ROOM+request.params.id, CACHE_TTL, async () => {
            return await showRoom(Number(request.params.id));
        });

        reply.code(200).send(room);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function updateRoomHandler(
    request: FastifyRequest<{
        Body: UpdateRoomInput;
    }>,
    reply: FastifyReply
) {
    try {
        const room = await updateRoom(request.body);
        await request.redis.invalidateCaches(CACHE_KEY_ROOMS, CACHE_KEY_FLOOR_ROOMS + room.floorId, CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId);

        reply.code(200).send(room);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function deleteRoomHandler(
    request: FastifyRequest<{
        Params: DeleteRoomParams;
    }>,
    reply: FastifyReply
) {
    try {
        const room = await deleteRoom(Number(request.params.id));
        await request.redis.invalidateCaches(CACHE_KEY_ROOMS, CACHE_KEY_FLOOR_ROOMS + room.floorId, CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId);

        reply.code(204).send(room);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}