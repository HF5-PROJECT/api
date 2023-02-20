import { FastifyReply, FastifyRequest } from "fastify";
import {
    createImage,
    browseImage,
    showImage,
    deleteImage
} from "./image.service";
import {
    CreateImageInput,
    ShowImageParams,
    DeleteImageParams
} from "./image.schema";
import { error_message } from "./image.errors";
import { HotelImages } from "@prisma/client";
import multipart from "@fastify/multipart";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_HOTEL_IMAGES = "allHotelImages";
const CACHE_KEY_HOTEL_IMAGE = "hotelImage";

export async function createHotelHandler(
    request: FastifyRequest<{
        Body: CreateImageInput;
    }>,
    reply: FastifyReply
) {
    try {
        return "ffk";
        return request.body;
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL_IMAGES);
        const hotel = await createImage(request.body);

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
        return "Kkk";
        const hotels = await request.redis.rememberJSON<HotelImages[]>(CACHE_KEY_HOTEL_IMAGES, CACHE_TTL, async () => {
            return await browseImage();
        });

        reply.code(200).send(hotels);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function showHotelHandler(
    request: FastifyRequest<{
        Params: ShowImageParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await request.redis.rememberJSON<HotelImages>(CACHE_KEY_HOTEL_IMAGE+request.params.id, CACHE_TTL, async () => {
            return await showImage(Number(request.params.id));
        });

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function deleteHotelHandler(
    request: FastifyRequest<{
        Params: DeleteImageParams;
    }>,
    reply: FastifyReply
) {
    try {
        await request.redis.invalidateCaches(CACHE_KEY_HOTEL_IMAGE+request.params.id, CACHE_KEY_HOTEL_IMAGES);
        const hotel = await deleteImage(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}