import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createFloorHandler,
    getAllFloorsHandler,
    getFloorHandler,
    updateFloorHandler,
    deleteFloorHandler,
    getRoomsByFloorsHandler,
} from "./floor.controller";
import { $ref } from "./floor.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                body: $ref("createFloorSchema"),
                response: {
                    201: $ref("createFloorResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor Create")],
        },
        createFloorHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                response: {
                    200: $ref("getAllFloorsResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor GetAll")],
        },
        getAllFloorsHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                response: {
                    200: $ref("getFloorResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor Get")],
        },
        getFloorHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                body: $ref("updateFloorSchema"),
                response: {
                    200: $ref("updateFloorResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor Update")],
        },
        updateFloorHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                response: {
                    204: $ref("deleteFloorResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor Delete")],
        },
        deleteFloorHandler
    );

    fastify.get(
        "/:id/rooms",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Floor"],
                response: {
                    200: $ref("getRoomsByFloorResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("Floor-Rooms GetAll")],
        },
        getRoomsByFloorsHandler
    );
};
