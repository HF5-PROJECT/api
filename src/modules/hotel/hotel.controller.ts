import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotel,
    browseHotel,
    showHotel,
    updateHotel,
    deleteHotel,
    showHotelFloors,
    showHotelRoomTypes,
} from "./hotel.service";
import {
    CreateHotelInput,
    UpdateHotelInput,
    ShowHotelParams,
    DeleteHotelParams,
    ShowHotelRoomTypeSchema,
    ShowHotelFloorSchema,
} from "./hotel.schema";
import { errorMessage } from "./hotel.errors";
import { Hotel, Floor, RoomType } from "@prisma/client";
import { userHasPermission } from "../auth/auth.service";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_HOTELS = "allHotels";
const CACHE_KEY_HOTEL = "hotel";
export const CACHE_KEY_HOTEL_ROOM_TYPES = "hotelRoomTypes";
export const CACHE_KEY_HOTEL_FLOORS = "hotelFloors";

export async function createHotelHandler(
    request: FastifyRequest<{
        Body: CreateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTELS);
        const hotel = await createHotel(request.body);

        reply.code(201).send(hotel);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function browseHotelHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const hotels = await request.redis.rememberJSON<Hotel[]>(CACHE_KEY_HOTELS, CACHE_TTL, async () => {
            return await browseHotel();
        });

        reply.code(200).send(hotels);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function showHotelHandler(
    request: FastifyRequest<{
        Params: ShowHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await request.redis.rememberJSON<Hotel>(CACHE_KEY_HOTEL + request.params.id, CACHE_TTL, async () => {
            return await showHotel(Number(request.params.id));
        });

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function updateHotelHandler(
    request: FastifyRequest<{
        Body: UpdateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL + request.body.id, CACHE_KEY_HOTELS);
        const hotel = await updateHotel(request.body);

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function deleteHotelHandler(
    request: FastifyRequest<{
        Params: DeleteHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL + request.params.id, CACHE_KEY_HOTELS);
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function showHotelRoomTypeHandler(
    request: FastifyRequest<{
        Params: ShowHotelRoomTypeSchema;
    }>,
    reply: FastifyReply
) {
    try {
        const roomTypes = await request.redis.rememberJSON<RoomType[]>(CACHE_KEY_HOTEL_ROOM_TYPES + request.params.id, CACHE_TTL, async () => {
            return await showHotelRoomTypes(Number(request.params.id));
        });

        reply.code(200).send(roomTypes);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function showHotelFloorsHandler(
    request: FastifyRequest<{
        Params: ShowHotelFloorSchema;
    }>,
    reply: FastifyReply
) {
    try {
        const floors = await request.redis.rememberJSON<Floor[]>(CACHE_KEY_HOTEL_FLOORS + request.params.id, CACHE_TTL, async () => {
            return await showHotelFloors(Number(request.params.id));
        });

        reply.code(200).send(floors);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}