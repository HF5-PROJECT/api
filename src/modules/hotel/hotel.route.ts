import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelHandler,
    browseHotelHandler,
    showHotelHandler,
    updateHotelHandler,
    deleteHotelHandler,
    showHotelFloorHandler,
    showHotelRoomTypeHandler,
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
                    200: $ref("showHotelResponseSchema"),
                },
            },
        },
        showHotelHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Hotel"],
                body: $ref("updateHotelSchema"),
                response: {
                    200: $ref("updateHotelResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate],
        },
        updateHotelHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Hotel"],
                response: {
                    204: $ref("deleteHotelResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate],
        },
        deleteHotelHandler
    );

    fastify.get(
        "/:id/floors",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("showHotelFloorResponseSchema"),
                },
            },
        },
        showHotelFloorHandler
    );

    fastify.get(
        "/:id/room_types",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("showHotelRoomTypeResponseSchema"),
                },
            },
        },
        showHotelRoomTypeHandler
    );
};
