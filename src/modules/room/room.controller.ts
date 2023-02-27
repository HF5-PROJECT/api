import { FastifyReply, FastifyRequest } from "fastify";
import {
    createRoom,
    updateRoom,
    deleteRoom,
    getAllRooms,
    getRoomById,
} from "./room.service";
import {
    CreateRoomInput,
    UpdateRoomInput,
    getRoomParams,
    DeleteRoomParams,
} from "./room.schema";
import { errorMessage } from "../../utils/string";
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
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOMS,
            CACHE_KEY_FLOOR_ROOMS + room.floorId,
            CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId
        );

        return reply.code(201).send(room);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getAllRoomsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const rooms = await request.redis.rememberJSON<Room[]>(
            CACHE_KEY_ROOMS,
            CACHE_TTL,
            async () => {
                return await getAllRooms();
            }
        );

        return reply.code(200).send(rooms);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getRoomHandler(
    request: FastifyRequest<{
        Params: getRoomParams;
    }>,
    reply: FastifyReply
) {
    try {
        const room = await request.redis.rememberJSON<Room>(
            CACHE_KEY_ROOM + request.params.id,
            CACHE_TTL,
            async () => {
                return await getRoomById(Number(request.params.id));
            }
        );

        return reply.code(200).send(room);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
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
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOMS,
            CACHE_KEY_FLOOR_ROOMS + room.floorId,
            CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId
        );

        return reply.code(200).send(room);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
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
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOMS,
            CACHE_KEY_FLOOR_ROOMS + room.floorId,
            CACHE_KEY_ROOM_TYPE_ROOMS + room.roomTypeId
        );

        return reply.code(204).send(room);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}
