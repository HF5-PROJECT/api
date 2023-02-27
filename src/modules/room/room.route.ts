import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createRoomHandler,
    browseRoomHandler,
    getRoomHandler,
    updateRoomHandler,
    deleteRoomHandler,
} from "./room.controller";
import { $ref } from "./room.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                tags: ["Room"],
                body: $ref("createRoomSchema"),
                response: {
                    201: $ref("createRoomResponseSchema"),
                },
            },
        },
        createRoomHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["Room"],
                response: {
                    200: $ref("browseRoomResponseSchema"),
                },
            },
        },
        browseRoomHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["Room"],
                response: {
                    200: $ref("getRoomResponseSchema"),
                },
            },
        },
        getRoomHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                tags: ["Room"],
                body: $ref("updateRoomSchema"),
                response: {
                    200: $ref("updateRoomResponseSchema"),
                },
            },
        },
        updateRoomHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                tags: ["Room"],
                response: {
                    204: $ref("deleteRoomResponseSchema"),
                },
            },
        },
        deleteRoomHandler
    );
};
