import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createRoomTypeHandler,
    browseRoomTypeHandler,
    showRoomTypeHandler,
    updateRoomTypeHandler,
    deleteRoomTypeHandler
} from "./room_type.controller";
import { $ref } from "./room_type.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                tags: ["RoomType"],
                body: $ref("createRoomTypeSchema"),
                response: {
                    201: $ref("createRoomTypeResponseSchema"),
                },
            },
        },
        createRoomTypeHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["RoomType"],
                response: {
                    200: $ref("browseRoomTypeResponseSchema"),
                },
            },
        },
        browseRoomTypeHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["RoomType"],
                response: {
                    200: $ref("showRoomTypeResponseSchema"),
                },
            },
        },
        showRoomTypeHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                tags: ["RoomType"],
                body: $ref("updateRoomTypeSchema"),
                response: {
                    200: $ref("updateRoomTypeResponseSchema"),
                },
            },
        },
        updateRoomTypeHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                tags: ["RoomType"],
                response: {
                    204: $ref("deleteRoomTypeResponseSchema"),
                },
            },
        },
        deleteRoomTypeHandler
    );
};
