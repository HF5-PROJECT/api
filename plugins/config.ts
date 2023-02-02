import { FastifyInstance, FastifyPluginOptions } from "fastify";

import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

async function configPlugin(
    server: FastifyInstance,
    options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void
) {
    const schema = {
        type: "object",
        required: [],
        properties: {
            HOST: {
                type: "string",
                default: "0.0.0.0",
            },
            PORT: {
                type: "number",
                default: 3000,
            },
        },
    };

    const configOptions = {
        // decorate the Fastify server instance with `config` key
        // such as `fastify.config('PORT')
        confKey: "config",
        // schema to validate
        schema: schema,
        // source for the configuration data
        data: process.env,
        // will read .env in root folder
        dotenv: true,
        // will remove the additional properties
        // from the data object which creates an
        // explicit schema
        removeAdditional: true,
    };

    return fastifyEnv(server, configOptions, done);
}

export default fastifyPlugin(configPlugin);

declare module "fastify" {
    interface FastifyInstance {
        config: {
            HOST: string;
            PORT: number;
        };
    }
}
