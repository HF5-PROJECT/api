import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const imageCore = {
    path: z.string({
        required_error: "Path is required",
        invalid_type_error: "Path must be a string",
    }).min(1),
    order: z.number(),
    hotel_id: z.number({
        required_error: "Hotel ID (hotel_id) is required",
        invalid_type_error: "ID must be a number",
    }),
};

const showImageSchema = z.object({
    id: z.string()
});

const showImageResponseSchema = z.object({
    id: z.number(),
    ...imageCore
});

const browseImageResponseSchema = z.array(showImageResponseSchema);

const createImageSchema = z.object({
    ...imageCore
});

const createImageResponseSchema = z.object({
    id: z.number(),
    ...imageCore,
});

const deleteImageSchema = z.object({
    id: z.string()
});

const deleteImageResponseSchema = z.object({
    id: z.number(),
    ...imageCore
});

export type CreateImageInput = z.infer<typeof createImageSchema>;
export type ShowImageParams = z.infer<typeof showImageSchema>;
export type DeleteImageParams = z.infer<typeof deleteImageSchema>;

export const { schemas: hotelImageSchemas, $ref } = buildJsonSchemas({
    createImageSchema,
    createImageResponseSchema,
    browseImageResponseSchema,
    showImageSchema,
    showImageResponseSchema,
    deleteImageSchema,
    deleteImageResponseSchema
}, {
    $id: "hotelImageSchema"
});
