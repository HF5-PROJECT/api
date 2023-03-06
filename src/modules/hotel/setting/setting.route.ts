import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelSettingHandler,
    getAllHotelSettingsHandler,
    getHotelSettingHandler,
    updateHotelSettingHandler,
    deleteHotelSettingHandler,
} from "./setting.controller";
import { $ref } from "./setting.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelSetting"],
                body: $ref("createHotelSettingSchema"),
                response: {
                    201: $ref("createHotelSettingResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelSetting Create")],
        },
        createHotelSettingHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelSetting"],
                response: {
                    200: $ref("getAllHotelSettingsResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelSetting GetAll")],
        },
        getAllHotelSettingsHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelSetting"],
                response: {
                    200: $ref("getHotelSettingResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelSetting Get")],
        },
        getHotelSettingHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelSetting"],
                body: $ref("updateHotelSettingSchema"),
                response: {
                    200: $ref("updateHotelSettingResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelSetting Update")],
        },
        updateHotelSettingHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelSetting"],
                response: {
                    204: $ref("deleteHotelSettingResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelSetting Delete")],
        },
        deleteHotelSettingHandler
    );
};
