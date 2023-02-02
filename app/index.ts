import path from "path";
import fastifyAutoload from "@fastify/autoload";

import Fastify from "fastify";

export async function build() {
    const fastify = Fastify({ logger: false });

    // Register plugins
    await fastify.register(fastifyAutoload, {
        dir: path.join(__dirname, "../plugins"),
    });

    // Register routes
    await fastify.register(fastifyAutoload, {
        dir: path.join(__dirname, "../routes"),
        options: { prefix: "/api" },
    });

    return fastify;
}
