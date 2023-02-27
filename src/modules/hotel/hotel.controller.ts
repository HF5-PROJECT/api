import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotel,
    updateHotel,
    deleteHotel,
    getAllHotels,
    getHotelById,
} from "./hotel.service";
import {
    CreateHotelInput,
    UpdateHotelInput,
    GetHotelParams,
    DeleteHotelParams,
    GetRoomTypesByHotelSchema,
    GetFloorsByHotelSchema,
} from "./hotel.schema";
import { errorMessage } from "./hotel.errors";
import { Hotel, Floor, RoomType } from "@prisma/client";
import { getRoomTypesByHotelId } from "../room/type/type.service";
import { getFloorsByHotelId } from "../floor/floor.service";

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
        const hotels = await request.redis.rememberJSON<Hotel[]>(
            CACHE_KEY_HOTELS,
            CACHE_TTL,
            async () => {
                return await getAllHotels();
            }
        );

        reply.code(200).send(hotels);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function getHotelHandler(
    request: FastifyRequest<{
        Params: GetHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await request.redis.rememberJSON<Hotel>(
            CACHE_KEY_HOTEL + request.params.id,
            CACHE_TTL,
            async () => {
                return await getHotelById(Number(request.params.id));
            }
        );

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
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL + request.body.id,
            CACHE_KEY_HOTELS
        );
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
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL + request.params.id,
            CACHE_KEY_HOTELS
        );
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function getRoomTypesByHotelHandler(
    request: FastifyRequest<{
        Params: GetRoomTypesByHotelSchema;
    }>,
    reply: FastifyReply
) {
    try {
        const roomTypes = await request.redis.rememberJSON<RoomType[]>(
            CACHE_KEY_HOTEL_ROOM_TYPES + request.params.id,
            CACHE_TTL,
            async () => {
                return await getRoomTypesByHotelId(Number(request.params.id));
            }
        );

        reply.code(200).send(roomTypes);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}

export async function getFloorsByHotelsHandler(
    request: FastifyRequest<{
        Params: GetFloorsByHotelSchema;
    }>,
    reply: FastifyReply
) {
    try {
        const floors = await request.redis.rememberJSON<Floor[]>(
            CACHE_KEY_HOTEL_FLOORS + request.params.id,
            CACHE_TTL,
            async () => {
                return await getFloorsByHotelId(Number(request.params.id));
            }
        );

        reply.code(200).send(floors);
    } catch (e) {
        return reply.badRequest(await errorMessage(e));
    }
}
