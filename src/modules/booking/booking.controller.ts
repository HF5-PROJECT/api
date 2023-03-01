import { FastifyReply, FastifyRequest } from "fastify";
import { createBooking } from "./booking.service";
import { BookRoomsInput } from "./booking.schema";
import { errorMessage } from "../../utils/string";
import { getRoomTypesByIds } from "../room/type/type.service";
import { prisma } from "../../plugins/prisma";
import { Booking } from "@prisma/client";
import { getAvailableRoomsByRoomTypesAndDateInterval } from "./room/room.service";

export async function bookRoomsHandler(
    request: FastifyRequest<{
        Body: BookRoomsInput;
    }>,
    reply: FastifyReply
) {
    try {
        let booking: Booking | undefined;

        console.log(request.user);

        await prisma.$transaction(async () => {
            booking = await createBooking(
                {
                    start: request.body.start,
                    end: request.body.end,
                },
                request.user.sub
            );

            const roomTypesToBook = await getRoomTypesByIds(
                request.body.roomTypeIds
            );

            const roomsToBook =
                await getAvailableRoomsByRoomTypesAndDateInterval(
                    roomTypesToBook,
                    request.body.start,
                    request.body.end
                );

            console.log(booking);
            console.log(roomTypesToBook);
            console.log(roomsToBook);

            throw Error();

            // Book rooms...
        });

        return reply.code(201).send(booking);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}
