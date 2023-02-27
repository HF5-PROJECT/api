import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { roomSchema } from "../room.schema";

const roomTypeCore = {
    name: z
        .string({
            required_error: "Room type name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1),
    description: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    price: z.number(),
    hotelId: z.number(),
};

const getRoomTypeSchema = z.object({
    id: z.string(),
});

const getRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const browseRoomTypeResponseSchema = z.array(getRoomTypeResponseSchema);

const createRoomTypeSchema = z.object({
    ...roomTypeCore,
});

const createRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const updateRoomTypeSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const updateRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const deleteRoomTypeSchema = z.object({
    id: z.string(),
});

const deleteRoomTypeResponseSchema = z.object({
    id: z.number(),
    ...roomTypeCore,
});

const getRoomsByRoomTypeSchema = z.object({
    id: z.string(),
});

const getRoomsByRoomTypeResponseSchema = z.array(roomSchema);

export const roomTypeSchema = getRoomTypeResponseSchema;

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
export type GetRoomTypeParams = z.infer<typeof getRoomTypeSchema>;
export type DeleteRoomTypeParams = z.infer<typeof deleteRoomTypeSchema>;
export type GetRoomsByRoomTypeParams = z.infer<typeof getRoomsByRoomTypeSchema>;

export const { schemas: roomTypeSchemas, $ref } = buildJsonSchemas(
    {
        createRoomTypeSchema,
        createRoomTypeResponseSchema,
        browseRoomTypeResponseSchema,
        getRoomTypeSchema,
        getRoomTypeResponseSchema,
        updateRoomTypeSchema,
        updateRoomTypeResponseSchema,
        deleteRoomTypeSchema,
        deleteRoomTypeResponseSchema,
        getRoomsByRoomTypeSchema,
        getRoomsByRoomTypeResponseSchema,
    },
    {
        $id: "roomTypeSchema",
    }
);
