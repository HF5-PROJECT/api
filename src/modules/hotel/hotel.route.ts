import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelHandler,
    getAllHotelsHandler,
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
                headers: {
                    Authorization: true,
                },
                tags: ["Hotel"],
                body: $ref("createHotelSchema"),
                response: {
                    201: $ref("createHotelResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Hotel Create")],
        },
        createHotelHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["Hotel"],
                response: {
                    200: $ref("getAllHotelsResponseSchema"),
                },
            },
        },
        getAllHotelsHandler
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
                headers: {
                    Authorization: true,
                },
                tags: ["Hotel"],
                body: $ref("updateHotelSchema"),
                response: {
                    200: $ref("updateHotelResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Hotel Update")],
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
            onRequest: [fastify.authenticate, fastify.hasPermission("Hotel Delete")],
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
            onRequest: [fastify.authenticate, fastify.hasPermission("Hotel-Floors GetAll")],
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
