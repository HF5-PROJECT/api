import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { roomSchema } from "../room/room.schema";

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

const getFloorSchema = z.object({
    id: z.number(),
});

const getFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const getAllFloorsResponseSchema = z.array(getFloorResponseSchema);

const createFloorSchema = z.object({
    ...floorCore,
});

const createFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const updateFloorSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const updateFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const deleteFloorSchema = z.object({
    id: z.number(),
});

const deleteFloorResponseSchema = z.object({
    id: z.number(),
    ...floorCore,
});

const getRoomsByFloorSchema = z.object({
    id: z.number(),
});

const getRoomsByFloorResponseSchema = z.array(roomSchema);

export const floorSchema = getFloorResponseSchema;

export type CreateFloorInput = z.infer<typeof createFloorSchema>;
export type UpdateFloorInput = z.infer<typeof updateFloorSchema>;
export type GetFloorParams = z.infer<typeof getFloorSchema>;
export type DeleteFloorParams = z.infer<typeof deleteFloorSchema>;
export type GetRoomsByFloorParams = z.infer<typeof getRoomsByFloorSchema>;

export const { schemas: floorSchemas, $ref } = buildJsonSchemas(
    {
        createFloorSchema,
        createFloorResponseSchema,
        getAllFloorsResponseSchema,
        getFloorSchema,
        getFloorResponseSchema,
        updateFloorSchema,
        updateFloorResponseSchema,
        deleteFloorSchema,
        deleteFloorResponseSchema,
        getRoomsByFloorSchema,
        getRoomsByFloorResponseSchema,
    },
    {
        $id: "floorSchema",
    }
);
