import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const bookingRoomCore = {
    bookingId: z.number(),
    roomId: z.number(),
    price: z.number(),
};

const createBookingRoomSchema = z.object({
    ...bookingRoomCore,
});

export type CreateBookingInput = z.infer<typeof createBookingRoomSchema>;
export const { schemas: bookingSchemas, $ref } = buildJsonSchemas(
    {
        createBookingRoomSchema,
    },
    {
        $id: "bookingRoomSchema",
    }
);
