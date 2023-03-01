import {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { userHasPermission } from "../modules/auth/auth.service";

declare module "fastify" {
    interface FastifyInstance {
        hasPermission(permissionName: string): (request: FastifyRequest<{ Params: any, Body: any }>, reply: FastifyReply) => Promise<void>;
    }
}

export default fastifyPlugin(
    async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
        fastify.addHook("preHandler", (req, reply, next) => {
            return next();
        });

        fastify.decorate(
            "hasPermission",
            (permissionName: string) => {
                return async (request: FastifyRequest<{ Params: any, Body: any }>, reply: FastifyReply) => {
                    try {
                        await userHasPermission(request.user, permissionName)
                    } catch (err) {
                        reply.unauthorized();
                    }
                }
            }
        );
    },
    { dependencies: ["config", "cookie"] }
);
