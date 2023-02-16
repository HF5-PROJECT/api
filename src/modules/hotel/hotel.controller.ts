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

export async function createHotelHandler(
    request: FastifyRequest<{
        Body: CreateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
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
        const hotels = await request.redis.rememberJSON<Hotel[]>("memCachedAllHotels", 1800, async () => {
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
        const hotel = await request.redis.rememberJSON<Hotel>("memCachedHotel"+request.params.id, 1800, async () => {
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
        removeRedisCache(request, "memCachedHotel"+request.body.id);
        removeRedisCache(request, "memCachedAllHotels");
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
        removeRedisCache(request, "memCachedHotel"+request.params.id);
        removeRedisCache(request, "memCachedAllHotels");
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function removeRedisCache(request: FastifyRequest, key: string) {
    await request.redis.del(key);
}