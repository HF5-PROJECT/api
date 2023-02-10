import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    name: z.string().min(1),
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .min(1)
        .email(),
    address: z.string().nullable().optional(),
};

const createUserSchema = z.object({
    ...userCore,
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .min(8),
});

const createUserResponseSchema = z.object({
    ...userCore,
});

const loginSchema = z.object({
    email: userCore.email,
    password: z
        .string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        })
        .min(1),
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
