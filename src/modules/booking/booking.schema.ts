import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const bookingCore = {
    start: z.date(),
    end: z.date(),
};

const createBookingSchema = z.object({
    ...bookingCore,
});

const bookRoomsSchema = z.object({
    start: z.date(),
    end: z.date(),
    roomTypeIds: z.array(z.number()).min(1),
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
