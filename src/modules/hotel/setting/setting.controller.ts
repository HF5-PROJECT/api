import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotelSetting,
    updateHotelSetting,
    deleteHotelSetting,
    getAllHotelSettings,
    getHotelSettingById,
} from "./setting.service";
import {
    CreateHotelSettingInput,
    UpdateHotelSettingInput,
    GetHotelSettingParams,
    DeleteHotelSettingParams,
} from "./setting.schema";
import { errorMessage } from "../../../utils/string";
import { HotelSetting, Room } from "@prisma/client";
import { CACHE_KEY_HOTEL_HOTEL_SETTINGS } from "../hotel.controller";

// In Seconds
const CACHE_TTL = 1800;

const CACHE_KEY_HOTEL_SETTINGS = "allHotelSettings";
const CACHE_KEY_HOTEL_SETTING = "hotelSetting";

export async function createHotelSettingHandler(
    request: FastifyRequest<{
        Body: CreateHotelSettingInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelSetting = await createHotelSetting(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_SETTINGS,
            CACHE_KEY_HOTEL_HOTEL_SETTINGS + hotelSetting.hotelId
        );

        return reply.code(201).send(hotelSetting);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getAllHotelSettingsHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const hotelSettings = await request.redis.rememberJSON<HotelSetting[]>(
            CACHE_KEY_HOTEL_SETTINGS,
            CACHE_TTL,
            async () => {
                return await getAllHotelSettings();
            }
        );

        return reply.code(200).send(hotelSettings);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function getHotelSettingHandler(
    request: FastifyRequest<{
        Params: GetHotelSettingParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelSetting = await request.redis.rememberJSON<HotelSetting>(
            CACHE_KEY_HOTEL_SETTING + request.params.id,
            CACHE_TTL,
            async () => {
                return await getHotelSettingById(Number(request.params.id));
            }
        );

        return reply.code(200).send(hotelSetting);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function updateHotelSettingHandler(
    request: FastifyRequest<{
        Body: UpdateHotelSettingInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelSetting = await updateHotelSetting(request.body);
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_SETTING + request.body.id,
            CACHE_KEY_HOTEL_SETTINGS,
            CACHE_KEY_HOTEL_HOTEL_SETTINGS + hotelSetting.hotelId
        );

        return reply.code(200).send(hotelSetting);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}

export async function deleteHotelSettingHandler(
    request: FastifyRequest<{
        Params: DeleteHotelSettingParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotelSetting = await deleteHotelSetting(Number(request.params.id));
        await request.redis.invalidateCaches(
            CACHE_KEY_HOTEL_SETTING + request.params.id,
            CACHE_KEY_HOTEL_SETTINGS,
            CACHE_KEY_HOTEL_HOTEL_SETTINGS + hotelSetting.hotelId
        );

        return reply.code(204).send(hotelSetting);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}