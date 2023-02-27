import { FastifyReply, FastifyRequest } from "fastify";
import {
    createFloor,
    updateFloor,
    deleteFloor,
    getAllFloors,
    getFloorById,
} from "./floor.service";
import {
    CreateFloorInput,
    UpdateFloorInput,
    GetFloorParams,
    DeleteFloorParams,
    GetRoomsByFloorParams,
} from "./floor.schema";
import { errorMessage } from "../../utils/string";
import { Floor, Room } from "@prisma/client";
import { CACHE_KEY_HOTEL_FLOORS } from "../hotel/hotel.controller";
import { getRoomsByFloorId } from "../room/room.service";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_FLOORS = "allFloors";
const CACHE_KEY_FLOOR = "floor";
export const CACHE_KEY_FLOOR_ROOMS = "floorRooms";

export async function createFloorHandler(
    request: FastifyRequest<{
        Body: CreateFloorInput;
    }>,
    reply: FastifyReply
) {
    try {
        const floor = await createFloor(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_FLOORS,
            CACHE_KEY_HOTEL_FLOORS + floor.hotelId
        );

        return reply.code(201).send(floor);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getAllFloorsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const floors = await request.redis.rememberJSON<Floor[]>(
            CACHE_KEY_FLOORS,
            CACHE_TTL,
            async () => {
                return await getAllFloors();
            }
        );

        return reply.code(200).send(floors);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getFloorHandler(
    request: FastifyRequest<{
        Params: GetFloorParams;
    }>,
    reply: FastifyReply
) {
    try {
        const floor = await request.redis.rememberJSON<Floor>(
            CACHE_KEY_FLOOR + request.params.id,
            CACHE_TTL,
            async () => {
                return await getFloorById(Number(request.params.id));
            }
        );

        return reply.code(200).send(floor);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function updateFloorHandler(
    request: FastifyRequest<{
        Body: UpdateFloorInput;
    }>,
    reply: FastifyReply
) {
    try {
        const floor = await updateFloor(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_FLOOR + request.body.id,
            CACHE_KEY_FLOORS,
            CACHE_KEY_HOTEL_FLOORS + floor.hotelId
        );

        return reply.code(200).send(floor);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function deleteFloorHandler(
    request: FastifyRequest<{
        Params: DeleteFloorParams;
    }>,
    reply: FastifyReply
) {
    try {
        const floor = await deleteFloor(Number(request.params.id));
        await request.redis.invalidateCaches(
            CACHE_KEY_FLOOR + request.params.id,
            CACHE_KEY_FLOORS,
            CACHE_KEY_HOTEL_FLOORS + floor.hotelId
        );

        return reply.code(204).send(floor);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getRoomsByFloorsHandler(
    request: FastifyRequest<{
        Params: GetRoomsByFloorParams;
    }>,
    reply: FastifyReply
) {
    try {
        const rooms = await request.redis.rememberJSON<Room[]>(
            CACHE_KEY_FLOOR_ROOMS + request.params.id,
            CACHE_TTL,
            async () => {
                return await getRoomsByFloorId(Number(request.params.id));
            }
        );

        return reply.code(200).send(rooms);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}
