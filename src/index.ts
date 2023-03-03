import path from "path";
import fastifyAutoload from "@fastify/autoload";

import Fastify from "fastify";
import { authSchemas } from "./modules/auth/auth.schema";
import { hotelSchemas } from "./modules/hotel/hotel.schema";
import { floorSchemas } from "./modules/floor/floor.schema";
import { roomTypeSchemas } from "./modules/room/type/type.schema";
import { roomSchemas } from "./modules/room/room.schema";
import { hotelSettingSchemas } from "./modules/hotel/setting/setting.schema";
import { hotelInformationSchemas } from "./modules/hotel/information/information.schema";

export async function build() {
    const fastify = Fastify({
        logger: {
            level: "error",
        },
    });

    try {
        // Register health route
        fastify.get("/api/health", async (request, response) => {
            return { status: "OK" };
        });

        // Register plugins
        await fastify.register(fastifyAutoload, {
            dir: path.join(__dirname, "./plugins"),
        });

        // This has to be done manually as fastify autoload does not support adding schemas somehow?!
        for (const schema of [
            ...authSchemas,
            ...hotelSchemas,
            ...hotelSettingSchemas,
            ...hotelInformationSchemas,
            ...floorSchemas,
            ...roomTypeSchemas,
            ...roomSchemas,
        ]) {
            fastify.addSchema(schema);
        }

        // Register routes
        await fastify.register(fastifyAutoload, {
            dir: path.join(__dirname, "./modules/"),
            options: { prefix: "/api" },
            matchFilter: (path) => path.endsWith(".route.ts"),
        });
    } catch (e) {
        console.error(e);
    }

    return fastify;
}
