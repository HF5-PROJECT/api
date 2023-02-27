import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { floorSchema } from "../floor/floor.schema";
import { roomTypeSchema } from "../room/type/type.schema";

const hotelCore = {
    name: z
        .string({
            required_error: "Hotel name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1),
    description: z.string().nullable().optional(),
    address: z
        .string({
            required_error: "Address is required",
            invalid_type_error: "Address must be a string",
        })
        .min(1),
};

const getHotelSchema = z.object({
    id: z.string(),
});

const getHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const browseHotelResponseSchema = z.array(getHotelResponseSchema);

const createHotelSchema = z.object({
    ...hotelCore,
});

const createHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const updateHotelSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const updateHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const deleteHotelSchema = z.object({
    id: z.string(),
});

const deleteHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const GetFloorsByHotelSchema = z.object({
    id: z.string(),
});

const getFloorsByHotelResponseSchema = z.array(floorSchema);

const GetRoomTypesByHotelSchema = z.object({
    id: z.string(),
});

const getRoomTypesByHotelResponseSchema = z.array(roomTypeSchema);

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type GetHotelParams = z.infer<typeof getHotelSchema>;
export type DeleteHotelParams = z.infer<typeof deleteHotelSchema>;
export type GetFloorsByHotelSchema = z.infer<typeof GetFloorsByHotelSchema>;
export type GetRoomTypesByHotelSchema = z.infer<
    typeof GetRoomTypesByHotelSchema
>;

export const { schemas: hotelSchemas, $ref } = buildJsonSchemas(
    {
        createHotelSchema,
        createHotelResponseSchema,
        browseHotelResponseSchema,
        getHotelSchema,
        getHotelResponseSchema,
        updateHotelSchema,
        updateHotelResponseSchema,
        deleteHotelSchema,
        deleteHotelResponseSchema,
        GetFloorsByHotelSchema,
        getFloorsByHotelResponseSchema,
        GetRoomTypesByHotelSchema,
        getRoomTypesByHotelResponseSchema,
    },
    {
        $id: "hotelSchema",
    }
);
