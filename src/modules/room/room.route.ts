import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createRoomHandler,
    getAllRoomsHandler,
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
                headers: {
                    Authorization: true,
                },
                tags: ["Room"],
                body: $ref("createRoomSchema"),
                response: {
                    201: $ref("createRoomResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Room Create")],
        },
        createRoomHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Room"],
                response: {
                    200: $ref("getAllRoomsResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Room GetAll")],
        },
        getAllRoomsHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Room"],
                response: {
                    200: $ref("getRoomResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Room Get")],
        },
        getRoomHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Room"],
                body: $ref("updateRoomSchema"),
                response: {
                    200: $ref("updateRoomResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Room Update")],
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
            onRequest: [fastify.authenticate, fastify.hasPermission("Room Delete")],
        },
        deleteRoomHandler
    );
};
