import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelHandler,
    browseHotelHandler,
    getHotelHandler,
    updateHotelHandler,
    deleteHotelHandler,
    getFloorsByHotelsHandler,
    getRoomTypesByHotelHandler,
} from "./hotel.controller";
import { $ref } from "./hotel.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                tags: ["Hotel"],
                body: $ref("createHotelSchema"),
                response: {
                    201: $ref("createHotelResponseSchema"),
                },
            },
        },
        createHotelHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("browseHotelResponseSchema"),
                },
            },
        },
        browseHotelHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("getHotelResponseSchema"),
                },
            },
        },
        getHotelHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                tags: ["Hotel"],
                body: $ref("updateHotelSchema"),
                response: {
                    200: $ref("updateHotelResponseSchema"),
                },
            },
        },
        updateHotelHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    204: $ref("deleteHotelResponseSchema"),
                },
            },
        },
        deleteHotelHandler
    );

    fastify.get(
        "/:id/floors",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("getFloorsByHotelResponseSchema"),
                },
            },
        },
        getFloorsByHotelsHandler
    );

    fastify.get(
        "/:id/room_types",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("getRoomTypesByHotelResponseSchema"),
                },
            },
        },
        getRoomTypesByHotelHandler
    );
};
