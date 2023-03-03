import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    createHotelInformationHandler,
    getAllHotelInformationsHandler,
    getHotelInformationHandler,
    updateHotelInformationHandler,
    deleteHotelInformationHandler,
} from "./information.controller";
import { $ref } from "./information.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelInformation"],
                body: $ref("createHotelInformationSchema"),
                response: {
                    201: $ref("createHotelInformationResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelInformation Create")],
        },
        createHotelInformationHandler
    );

    fastify.get(
        "/",
        {
            schema: {
                tags: ["HotelInformation"],
                response: {
                    200: $ref("getAllHotelInformationsResponseSchema"),
                },
            },
        },
        getAllHotelInformationsHandler
    );

    fastify.get(
        "/:id",
        {
            schema: {
                tags: ["HotelInformation"],
                response: {
                    200: $ref("getHotelInformationResponseSchema"),
                },
            },
        },
        getHotelInformationHandler
    );

    fastify.put(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelInformation"],
                body: $ref("updateHotelInformationSchema"),
                response: {
                    200: $ref("updateHotelInformationResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelInformation Update")],
        },
        updateHotelInformationHandler
    );

    fastify.delete(
        "/:id",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["HotelInformation"],
                response: {
                    204: $ref("deleteHotelInformationResponseSchema"),
                },
            },
            onRequest: [fastify.authenticate, fastify.hasPermission("HotelInformation Delete")],
        },
        deleteHotelInformationHandler
    );
};
