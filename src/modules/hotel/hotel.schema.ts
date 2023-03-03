import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { floorSchema } from "../floor/floor.schema";
import { roomTypeSchema } from "../room/type/type.schema";
import { hotelSettingSchema } from "./setting/setting.schema";
import { hotelInformationSchema } from "./information/information.schema";

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
    id: z.number(),
});

const getHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const getAllHotelsResponseSchema = z.array(getHotelResponseSchema);

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
    id: z.number(),
});

const deleteHotelResponseSchema = z.object({
    id: z.number(),
    ...hotelCore,
});

const getHotelSettingsByHotelSchema = z.object({
    id: z.number(),
});

const getHotelSettingsByHotelResponseSchema = z.array(hotelSettingSchema);

const getHotelInformationsByHotelSchema = z.object({
    id: z.number(),
});

const getHotelInformationsByHotelResponseSchema = z.array(hotelInformationSchema);

const getFloorsByHotelSchema = z.object({
    id: z.number(),
});

const getFloorsByHotelResponseSchema = z.array(floorSchema);

const getRoomTypesByHotelSchema = z.object({
    id: z.number(),
});

const getRoomTypesByHotelResponseSchema = z.array(roomTypeSchema);

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type GetHotelParams = z.infer<typeof getHotelSchema>;
export type DeleteHotelParams = z.infer<typeof deleteHotelSchema>;
export type GetHotelSettingsByHotelSchema = z.infer<typeof getHotelSettingsByHotelSchema>;
export type GetHotelInformationsByHotelSchema = z.infer<typeof getHotelInformationsByHotelSchema>;
export type GetFloorsByHotelSchema = z.infer<typeof getFloorsByHotelSchema>;
export type GetRoomTypesByHotelSchema = z.infer<typeof getRoomTypesByHotelSchema>;

export const { schemas: hotelSchemas, $ref } = buildJsonSchemas(
    {
        createHotelSchema,
        createHotelResponseSchema,
        getAllHotelsResponseSchema,
        getHotelSchema,
        getHotelResponseSchema,
        updateHotelSchema,
        updateHotelResponseSchema,
        deleteHotelSchema,
        deleteHotelResponseSchema,
        getHotelSettingsByHotelSchema,
        getHotelSettingsByHotelResponseSchema,
        getHotelInformationsByHotelSchema,
        getHotelInformationsByHotelResponseSchema,
        getFloorsByHotelSchema,
        getFloorsByHotelResponseSchema,
        getRoomTypesByHotelSchema,
        getRoomTypesByHotelResponseSchema,
    },
    {
        $id: "hotelSchema",
    }
);
