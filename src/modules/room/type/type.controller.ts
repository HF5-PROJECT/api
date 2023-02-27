import { FastifyReply, FastifyRequest } from "fastify";
import {
    createRoomType,
    updateRoomType,
    deleteRoomType,
    getAllRoomTypes,
    getRoomTypeById,
} from "./type.service";
import {
    CreateRoomTypeInput,
    UpdateRoomTypeInput,
    GetRoomTypeParams,
    DeleteRoomTypeParams,
    GetRoomsByRoomTypeParams,
} from "./type.schema";
import { errorMessage } from "./type.errors";
import { Room, RoomType } from "@prisma/client";
import { CACHE_KEY_HOTEL_ROOM_TYPES } from "../../hotel/hotel.controller";
import { getRoomsByRoomTypeId } from "../room.service";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_ROOM_TYPES = "allRoomTypes";
const CACHE_KEY_ROOM_TYPE = "roomType";
export const CACHE_KEY_ROOM_TYPE_ROOMS = "roomTypeRooms";

export async function createRoomTypeHandler(
    request: FastifyRequest<{
        Body: CreateRoomTypeInput;
    }>,
    reply: FastifyReply
) {
    try {
        const roomType = await createRoomType(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOM_TYPES,
            CACHE_KEY_HOTEL_ROOM_TYPES + roomType.hotelId
        );

        reply.code(201).send(roomType);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function browseRoomTypeHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const roomTypes = await request.redis.rememberJSON<RoomType[]>(
            CACHE_KEY_ROOM_TYPES,
            CACHE_TTL,
            async () => {
                return await getAllRoomTypes();
            }
        );

        reply.code(200).send(roomTypes);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function getRoomTypeHandler(
    request: FastifyRequest<{
        Params: GetRoomTypeParams;
    }>,
    reply: FastifyReply
) {
    try {
        const roomType = await request.redis.rememberJSON<RoomType>(
            CACHE_KEY_ROOM_TYPE + request.params.id,
            CACHE_TTL,
            async () => {
                return await getRoomTypeById(Number(request.params.id));
            }
        );

        reply.code(200).send(roomType);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function updateRoomTypeHandler(
    request: FastifyRequest<{
        Body: UpdateRoomTypeInput;
    }>,
    reply: FastifyReply
) {
    try {
        const roomType = await updateRoomType(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOM_TYPE + request.body.id,
            CACHE_KEY_ROOM_TYPES,
            CACHE_KEY_HOTEL_ROOM_TYPES + roomType.hotelId
        );

        reply.code(200).send(roomType);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function deleteRoomTypeHandler(
    request: FastifyRequest<{
        Params: DeleteRoomTypeParams;
    }>,
    reply: FastifyReply
) {
    try {
        const roomType = await deleteRoomType(Number(request.params.id));
        await request.redis.invalidateCaches(
            CACHE_KEY_ROOM_TYPE + request.params.id,
            CACHE_KEY_ROOM_TYPES,
            CACHE_KEY_HOTEL_ROOM_TYPES + roomType.hotelId
        );

        reply.code(204).send(roomType);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function getRoomsByRoomTypesHandler(
    request: FastifyRequest<{
        Params: GetRoomsByRoomTypeParams;
    }>,
    reply: FastifyReply
) {
    try {
        const rooms = await request.redis.rememberJSON<Room[]>(
            CACHE_KEY_ROOM_TYPE_ROOMS + request.params.id,
            CACHE_TTL,
            async () => {
                return await getRoomsByRoomTypeId(Number(request.params.id));
            }
        );

        reply.code(200).send(rooms);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}
