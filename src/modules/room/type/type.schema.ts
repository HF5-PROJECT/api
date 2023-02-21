import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const roomTypeCore = {
    name: z.string({
        required_error: "Room type name is required",
        invalid_type_error: "Name must be a string",
    }).min(1),
    description: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    price: z.number(),
    hotel_id: z.number(),
};

const showRoomTypeSchema = z.object({
    id: z.string()
});

const showRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore
});

const browseRoomTypeResponseSchema = z.array(showRoomTypeResponseSchema);

const createRoomTypeSchema = z.object({
    ...roomTypeCore
});

const createRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const updateRoomTypeSchema = z.object({
    id: z.number(),
    ...roomTypeCore
});

const updateRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore
});

const deleteRoomTypeSchema = z.object({
    id: z.string()
});

const deleteRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore
});

export const roomTypeSchema = showRoomTypeResponseSchema;

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
export type ShowRoomTypeParams = z.infer<typeof showRoomTypeSchema>;
export type DeleteRoomTypeParams = z.infer<typeof deleteRoomTypeSchema>;

export const { schemas: roomTypeSchemas, $ref } = buildJsonSchemas({
    createRoomTypeSchema,
    createRoomTypeResponseSchema,
    browseRoomTypeResponseSchema,
    showRoomTypeSchema,
    showRoomTypeResponseSchema,
    updateRoomTypeSchema,
    updateRoomTypeResponseSchema,
    deleteRoomTypeSchema,
    deleteRoomTypeResponseSchema
}, {
    $id: "roomTypeSchema"
});
