import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const hotelInformationCore = {
    key: z.string({
        required_error: "Hotel Information key is required",
        invalid_type_error: "Number must be an int",
    }),
    value: z.string({
        required_error: "Hotel Information value is required",
        invalid_type_error: "Number must be an int",
    }),
    hotelId: z.number({
        required_error: "Hotel ID is required",
        invalid_type_error: "Hotel ID must be an int",
    }),
};

const getHotelInformationSchema = z.object({
    id: z.number(),
});

const getHotelInformationResponseSchema = z.object({
    id: z.number(),
    ...hotelInformationCore,
});

const getAllHotelInformationsResponseSchema = z.array(getHotelInformationResponseSchema);

const createHotelInformationSchema = z.object({
    ...hotelInformationCore,
});

const createHotelInformationResponseSchema = z.object({
    id: z.number(),
    ...hotelInformationCore,
});

const updateHotelInformationSchema = z.object({
    id: z.number(),
    ...hotelInformationCore,
});

const updateHotelInformationResponseSchema = z.object({
    id: z.number(),
    ...hotelInformationCore,
});

const deleteHotelInformationSchema = z.object({
    id: z.number(),
});

const deleteHotelInformationResponseSchema = z.object({
    id: z.number(),
    ...hotelInformationCore,
});

export const hotelInformationSchema = getHotelInformationResponseSchema;

export type CreateHotelInformationInput = z.infer<typeof createHotelInformationSchema>;
export type UpdateHotelInformationInput = z.infer<typeof updateHotelInformationSchema>;
export type GetHotelInformationParams = z.infer<typeof getHotelInformationSchema>;
export type DeleteHotelInformationParams = z.infer<typeof deleteHotelInformationSchema>;

export const { schemas: hotelInformationSchemas, $ref } = buildJsonSchemas(
    {
        createHotelInformationSchema,
        createHotelInformationResponseSchema,
        getAllHotelInformationsResponseSchema,
        getHotelInformationSchema,
        getHotelInformationResponseSchema,
        updateHotelInformationSchema,
        updateHotelInformationResponseSchema,
        deleteHotelInformationSchema,
        deleteHotelInformationResponseSchema
    },
    {
        $id: "hotelInformationSchema",
    }
);
