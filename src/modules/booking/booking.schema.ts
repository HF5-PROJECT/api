import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const bookingCore = {
    start: z.date({
        required_error: "Start is required",
        invalid_type_error: "Start must be a date",
    }),
    end: z.date({
        required_error: "End is required",
        invalid_type_error: "End must be a date",
    }),
};

const createBookingSchema = z.object({
    ...bookingCore,
});

const bookRoomsSchema = z.object({
    ...bookingCore,
    roomTypeIds: z.array(z.number()),
});

const bookRoomsResponseSchema = z.object({
    id: z.number(),
    ...bookingCore,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookRoomsInput = z.infer<typeof bookRoomsSchema>;

export const { schemas: bookingSchemas, $ref } = buildJsonSchemas(
    {
        createBookingSchema,
        bookRoomsSchema,
        bookRoomsResponseSchema,
    },
    {
        $id: "bookingSchema",
    }
);
