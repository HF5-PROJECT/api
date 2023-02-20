import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotel,
    browseHotel,
    showHotel,
    updateHotel,
    deleteHotel
} from "./hotel.service";
import {
    CreateHotelInput,
    UpdateHotelInput,
    ShowHotelParams,
    DeleteHotelParams
} from "./hotel.schema";
import { findFloorByHotelId } from "../floor/floor.service"
import { error_message } from "./hotel.errors";
import { Floor, Hotel } from "@prisma/client";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_HOTELS = "allHotels";
const CACHE_KEY_HOTEL = "hotel";

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
        return reply.badRequest(await error_message(e));
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
        return reply.badRequest(await error_message(e));
    }
}

export async function showHotelHandler(
    request: FastifyRequest<{
        Params: ShowHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await request.redis.rememberJSON<Hotel>(CACHE_KEY_HOTEL+request.params.id, CACHE_TTL, async () => {
            return await showHotel(Number(request.params.id));
        });

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function updateHotelHandler(
    request: FastifyRequest<{
        Body: UpdateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL+request.body.id, CACHE_KEY_HOTELS);
        const hotel = await updateHotel(request.body);

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function deleteHotelHandler(
    request: FastifyRequest<{
        Params: DeleteHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL+request.params.id, CACHE_KEY_HOTELS);
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function browseHotelFloorHandler(
    request: FastifyRequest<{
        Params: ShowHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTELS);
        await request.redis.invalidateCaches("allFloors");
        const floors = await request.redis.rememberJSON<Floor[]>(CACHE_KEY_HOTELS, CACHE_TTL, async () => {
            return await findFloorByHotelId(Number(request.params.id));
        });

        reply.code(200).send(floors);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}