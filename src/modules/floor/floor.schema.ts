import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const floorCore = {
    number: z.number({
        required_error: "Floor number is required",
        invalid_type_error: "Number must be an int",
    }),
    hotelId: z.number({
        required_error: "Hotel ID is required",
        invalid_type_error: "Hotel ID must be an int",
    }),
};

const showFloorSchema = z.object({
    id: z.string()
});

const showFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore
});

const browseFloorResponseSchema = z.array(showFloorResponseSchema);

const createFloorSchema = z.object({
    ...floorCore
});

const createFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const updateFloorSchema = z.object({
    id: z.number(),
    ...floorCore
});

const updateFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore
});

const deleteFloorSchema = z.object({
    id: z.string()
});

const deleteFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore
});

export type CreateFloorInput = z.infer<typeof createFloorSchema>;
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>;
export type ShowFloorParams = z.infer<typeof showFloorSchema>;
export type DeleteFloorParams = z.infer<typeof deleteFloorSchema>;

export const FloorSchema = showFloorResponseSchema;

export const { schemas: floorSchemas, $ref } = buildJsonSchemas({
    createFloorSchema,
    createFloorResponseSchema,
    browseFloorResponseSchema,
    showFloorSchema,
    showFloorResponseSchema,
    updateFloorSchema,
    updateFloorResponseSchema,
    deleteFloorSchema,
    deleteFloorResponseSchema
}, {
    $id: "floorSchema"
});
