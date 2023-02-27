import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createFloorHandler,
    browseFloorHandler,
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
                tags: ["Floor"],
                body: $ref("createFloorSchema"),
                response: {
                    201: $ref("createFloorResponseSchema"),
                },
            },
        },
        createFloorHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["Floor"],
                response: {
                    200: $ref("browseFloorResponseSchema"),
                },
            },
        },
        browseFloorHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["Floor"],
                response: {
                    200: $ref("getFloorResponseSchema"),
                },
            },
        },
        getFloorHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                tags: ["Floor"],
                body: $ref("updateFloorSchema"),
                response: {
                    200: $ref("updateFloorResponseSchema"),
                },
            },
        },
        updateFloorHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                tags: ["Floor"],
                response: {
                    204: $ref("deleteFloorResponseSchema"),
                },
            },
        },
        deleteFloorHandler
    );

    fastify.get(
        "/:id/rooms",
        {
            schema: {
                tags: ["Floor"],
                response: {
                    200: $ref("getRoomsByFloorResponseSchema"),
                },
            },
        },
        getRoomsByFloorsHandler
    );
};
