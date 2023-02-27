import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const roomCore = {
    number: z.number({
        required_error: "Room number is required",
        invalid_type_error: "Number must be an int",
    }),
    floorId: z.number({
        required_error: "Floor ID is required",
        invalid_type_error: "Floor ID must be an int",
    }),
    roomTypeId: z.number({
        required_error: "Room Type ID is required",
        invalid_type_error: "Room Type ID must be an int",
    }),
};

const showRoomSchema = z.object({
    id: z.string()
});

const showRoomResponseSchema = z.object({
    id: z.number(),
    ...roomCore
});

const browseRoomResponseSchema = z.array(showRoomResponseSchema);

const createRoomSchema = z.object({
    ...roomCore
});

const createRoomResponseSchema = z.object({
    id: z.number(),
    ...roomCore,
});

const updateRoomSchema = z.object({
    id: z.number(),
    ...roomCore
});

const updateRoomResponseSchema = z.object({
    id: z.number(),
    ...roomCore
});

const deleteRoomSchema = z.object({
    id: z.string()
});

const deleteRoomResponseSchema = z.object({
    id: z.number(),
    ...roomCore
});

export const roomSchema = showRoomResponseSchema;

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type ShowRoomParams = z.infer<typeof showRoomSchema>;
export type DeleteRoomParams = z.infer<typeof deleteRoomSchema>;

export const { schemas: roomSchemas, $ref } = buildJsonSchemas({
    createRoomSchema,
    createRoomResponseSchema,
    browseRoomResponseSchema,
    showRoomSchema,
    showRoomResponseSchema,
    updateRoomSchema,
    updateRoomResponseSchema,
    deleteRoomSchema,
    deleteRoomResponseSchema
}, {
    $id: "roomSchema"
});
