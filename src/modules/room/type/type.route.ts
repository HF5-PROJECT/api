import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createRoomTypeHandler,
    getAllRoomsTypeHandler,
    getRoomTypeHandler,
    updateRoomTypeHandler,
    deleteRoomTypeHandler,
    getRoomsByRoomTypesHandler,
} from "./type.controller";
import { $ref } from "./type.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["RoomType"],
                body: $ref("createRoomTypeSchema"),
                response: {
                    201: $ref("createRoomTypeResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("RoomType Create")],
        },
        createRoomTypeHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["RoomType"],
                response: {
                    200: $ref("getAllRoomsTypeResponseSchema"),
                },
            },
        },
        getAllRoomsTypeHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["RoomType"],
                response: {
                    200: $ref("getRoomTypeResponseSchema"),
                },
            },
        },
        getRoomTypeHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["RoomType"],
                body: $ref("updateRoomTypeSchema"),
                response: {
                    200: $ref("updateRoomTypeResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("RoomType Update")],
        },
        updateRoomTypeHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["RoomType"],
                response: {
                    204: $ref("deleteRoomTypeResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("RoomType Delete")],
        },
        deleteRoomTypeHandler
    );

    fastify.get(
        "/:id/rooms",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["RoomType"],
                response: {
                    200: $ref("getRoomsByRoomTypeResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("RoomType-Rooms GetAll")],
        },
        getRoomsByRoomTypesHandler
    );
};
