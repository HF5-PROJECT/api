import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const hotelSettingCore = {
    key: z.string({
        required_error: "Hotel Setting key is required",
        invalid_type_error: "Number must be an int",
    }),
    value: z.string({
        required_error: "Hotel Setting value is required",
        invalid_type_error: "Number must be an int",
    }),
    hotelId: z.number({
        required_error: "Hotel ID is required",
        invalid_type_error: "Hotel ID must be an int",
    }),
};

const getHotelSettingSchema = z.object({
    id: z.number(),
});

const getHotelSettingResponseSchema = z.object({
    id: z.number(),
    ...hotelSettingCore,
});

const getAllHotelSettingsResponseSchema = z.array(getHotelSettingResponseSchema);

const createHotelSettingSchema = z.object({
    ...hotelSettingCore,
});

const createHotelSettingResponseSchema = z.object({
    id: z.number(),
    ...hotelSettingCore,
});

const updateHotelSettingSchema = z.object({
    id: z.number(),
    ...hotelSettingCore,
});

const updateHotelSettingResponseSchema = z.object({
    id: z.number(),
    ...hotelSettingCore,
});

const deleteHotelSettingSchema = z.object({
    id: z.number(),
});

const deleteHotelSettingResponseSchema = z.object({
    id: z.number(),
    ...hotelSettingCore,
});

export const hotelSettingSchema = getHotelSettingResponseSchema;

export type CreateHotelSettingInput = z.infer<typeof createHotelSettingSchema>;
export type UpdateHotelSettingInput = z.infer<typeof updateHotelSettingSchema>;
export type GetHotelSettingParams = z.infer<typeof getHotelSettingSchema>;
export type DeleteHotelSettingParams = z.infer<typeof deleteHotelSettingSchema>;

export const { schemas: hotelSettingSchemas, $ref } = buildJsonSchemas(
    {
        createHotelSettingSchema,
        createHotelSettingResponseSchema,
        getAllHotelSettingsResponseSchema,
        getHotelSettingSchema,
        getHotelSettingResponseSchema,
        updateHotelSettingSchema,
        updateHotelSettingResponseSchema,
        deleteHotelSettingSchema,
        deleteHotelSettingResponseSchema
    },
    {
        $id: "hotelSettingSchema",
    }
);
