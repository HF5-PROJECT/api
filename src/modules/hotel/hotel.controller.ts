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
import { error_message } from "./hotel.errors";
import { Hotel } from "@prisma/client";

// In Seconds
const cache_ttl = 1800;

const cache_key_hotels = "allHotels";
const cache_key_hotel = "hotel";

export async function createHotelHandler(
    request: FastifyRequest<{
        Body: CreateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        request.redis.invalidateCaches(cache_key_hotels);
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
        const hotels = await request.redis.rememberJSON<Hotel[]>(cache_key_hotels, cache_ttl, async () => {
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
        const hotel = await request.redis.rememberJSON<Hotel>(cache_key_hotel+request.params.id, cache_ttl, async () => {
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
        request.redis.invalidateCaches(cache_key_hotel+request.body.id, cache_key_hotels);
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
        request.redis.invalidateCaches(cache_key_hotel+request.params.id, cache_key_hotels);
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}