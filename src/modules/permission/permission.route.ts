import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    getAllPermissionsHandler,
} from "./permission.controller";
import { $ref } from "./permission.schema";

export default async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
   fastify.get(
        "/",
        {
            schema: {
                tags: ["Permission"],
                response: {
                    200: $ref("getAllPermissionsResponseSchema"),
                },
            },
        },
       getAllPermissionsHandler
    );
};
