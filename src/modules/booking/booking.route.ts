import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { bookRoomsHandler } from "./booking.controller";
import { $ref } from "./booking.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.post(
        "/rooms",
        {
            schema: {
                headers: {
                    Authorization: true,
                },
                tags: ["Booking"],
                body: $ref("bookRoomsSchema"),
                response: {
                    201: $ref("bookRoomsResponseSchema"),
                },
            },
            onResponse: [fastify.authenticate],
        },
        bookRoomsHandler
    );
};
