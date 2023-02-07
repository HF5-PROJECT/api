import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    name: z.string(),
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .email(),
    address: z.string(),
};

const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),
});

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userCore,
});

const loginSchema = z.object({
    email: userCore.email,
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),
});

const loginResponseSchema = z.object({
    accessToken: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
});
