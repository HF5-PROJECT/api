import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotelInformation,
    updateHotelInformation,
    deleteHotelInformation,
    getAllHotelInformations,
    getHotelInformationById,
} from "./information.service";
import {
    CreateHotelInformationInput,
    UpdateHotelInformationInput,
    GetHotelInformationParams,
    DeleteHotelInformationParams,
} from "./information.schema";
import { errorMessage } from "../../../utils/string";
import { HotelInformation, Room } from "@prisma/client";
import { CACHE_KEY_HOTEL_HOTEL_INFORMATIONS } from "../hotel.controller";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_HOTEL_INFORMATIONS = "allHotelInformations";
const CACHE_KEY_HOTEL_INFORMATION = "hotelInformation";

export async function createHotelInformationHandler(
    request: FastifyRequest<{
        Body: CreateHotelInformationInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelInformation = await createHotelInformation(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_INFORMATIONS,
            CACHE_KEY_HOTEL_HOTEL_INFORMATIONS + hotelInformation.hotelId
        );

        return reply.code(201).send(hotelInformation);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getAllHotelInformationsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const hotelInformations = await request.redis.rememberJSON<HotelInformation[]>(
            CACHE_KEY_HOTEL_INFORMATIONS,
            CACHE_TTL,
            async () => {
                return await getAllHotelInformations();
            }
        );

        return reply.code(200).send(hotelInformations);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getHotelInformationHandler(
    request: FastifyRequest<{
        Params: GetHotelInformationParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelInformation = await request.redis.rememberJSON<HotelInformation>(
            CACHE_KEY_HOTEL_INFORMATION + request.params.id,
            CACHE_TTL,
            async () => {
                return await getHotelInformationById(Number(request.params.id));
            }
        );

        return reply.code(200).send(hotelInformation);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function updateHotelInformationHandler(
    request: FastifyRequest<{
        Body: UpdateHotelInformationInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelInformation = await updateHotelInformation(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_INFORMATION + request.body.id,
            CACHE_KEY_HOTEL_INFORMATIONS,
            CACHE_KEY_HOTEL_HOTEL_INFORMATIONS + hotelInformation.hotelId
        );

        return reply.code(200).send(hotelInformation);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function deleteHotelInformationHandler(
    request: FastifyRequest<{
        Params: DeleteHotelInformationParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelInformation = await deleteHotelInformation(Number(request.params.id));
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_INFORMATION + request.params.id,
            CACHE_KEY_HOTEL_INFORMATIONS,
            CACHE_KEY_HOTEL_HOTEL_INFORMATIONS + hotelInformation.hotelId
        );

        return reply.code(204).send(hotelInformation);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}