import path from "path";
import fastifyAutoload from "@fastify/autoload";

import Fastify from "fastify";
import { authSchemas } from "./modules/auth/auth.schema";
import { hotelSchemas } from "./modules/hotel/hotel.schema";
import { roomTypeSchemas } from "./modules/room_type/room_type.schema";

export async function build() {
    const fastify = Fastify({ logger: { level: "fatal" } });

    // Register health route
    fastify.get("/api/health", async (request, response) => {
        return { status: "OK" };
    });

    // Register plugins
    await fastify.register(fastifyAutoload, {
        dir: path.join(__dirname, "./plugins"),
    });

    // This has to be done manually as fastify autoload does not support adding schemas somehow?!
    for (const schema of [...authSchemas, ...hotelSchemas, ...roomTypeSchemas]) {
        fastify.addSchema(schema);
    }

    // Register routes
    await fastify.register(fastifyAutoload, {
        dir: path.join(__dirname, "./modules/"),
        options: { prefix: "/api" },
        matchFilter: (path) => path.endsWith(".route.ts"),
    });

    return fastify;
}
