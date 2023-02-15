import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const hotelCore = {
    name: z.string({
        required_error: "Hotel name is required",
        invalid_type_error: "Name must be a string",
    }).min(1),
    description: z.string().nullable().optional(),
    address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
    }).min(1),
};

const showHotelSchema = z.object({
    id: z.string()
});

const showHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore
});

const browseHotelResponseSchema = z.array(showHotelResponseSchema);

const createHotelSchema = z.object({
    ...hotelCore
});

const createHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const updateHotelSchema = z.object({
    id: z.number(),
    ...hotelCore
});

const updateHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore
});

const deleteHotelSchema = z.object({
    id: z.string()
});

const deleteHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type ShowHotelParams = z.infer<typeof showHotelSchema>;
export type DeleteHotelParams = z.infer<typeof deleteHotelSchema>;

export const { schemas: hotelSchemas, $ref } = buildJsonSchemas({
    createHotelSchema,
    createHotelResponseSchema,
    browseHotelResponseSchema,
    showHotelSchema,
    showHotelResponseSchema,
    updateHotelSchema,
    updateHotelResponseSchema,
    deleteHotelSchema,
    deleteHotelResponseSchema
}, {
    $id: "hotelSchema"
});
