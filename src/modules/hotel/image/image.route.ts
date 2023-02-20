import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelHandler,
    browseHotelHandler,
    showHotelHandler,
    deleteHotelHandler
} from "./image.controller";
import { $ref } from "./image.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                tags: ["HotelImage"],
                body: $ref("createImageSchema"),
                response: {
                    201: $ref("createImageResponseSchema"),
                },
            },
        },
        createHotelHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["HotelImage"],
                response: {
                    200: $ref("browseImageResponseSchema"),
                },
            },
        },
        browseHotelHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["HotelImage"],
                response: {
                    200: $ref("showImageResponseSchema"),
                },
            },
        },
        showHotelHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                tags: ["HotelImage"],
                response: {
                    204: $ref("deleteImageResponseSchema"),
                },
            },
        },
        deleteHotelHandler
    );
};
