import { FastifyReply, FastifyRequest } from "fastify";
import { createBooking } from "./booking.service";
import { BookRoomsInput } from "./booking.schema";
import { errorMessage } from "../../utils/string";
import { getRoomTypesByIds } from "../room/type/type.service";
import { prisma } from "../../plugins/prisma";
import { Booking } from "@prisma/client";
import {
    createBookingRoom,
    getAvailableRoomsByRoomTypesAndDateInterval,
} from "./room/room.service";

export async function bookRoomsHandler(
    request: FastifyRequest<{
        Body: BookRoomsInput;
    }>,
    reply: FastifyReply
) {
    try {
        const todayAtStartOfDay = new Date();
        todayAtStartOfDay.setHours(0, 0, 0, 0);

        if (todayAtStartOfDay >= new Date(request.body.start)) {
            return reply.badRequest("body/start must be now or in the future");
        }

        if (request.body.start >= request.body.end) {
            return reply.badRequest("body/start must be before end");
        }

        let booking: Booking | undefined;

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

            const availableRoomsToBook =
                await getAvailableRoomsByRoomTypesAndDateInterval(
                    roomTypesToBook,
                    request.body.start,
                    request.body.end
                );

            availableRoomsToBook.sort((a, b) => {
                if (a.floorId === b.floorId) {
                    return a.number < b.number ? -1 : 1;
                } else {
                    return a.floorId < b.floorId ? -1 : 1;
                }
            });

            for (const roomTypeId of request.body.roomTypeIds) {
                const availableMatchingRooms = availableRoomsToBook.filter(
                    (availableRoom) => availableRoom.roomTypeId === roomTypeId
                );

                if (availableMatchingRooms.length === 0) {
                    throw Error(
                        "No available room of room type with id: " + roomTypeId
                    );
                }

                await createBookingRoom({
                    bookingId: booking.id,
                    price: availableMatchingRooms[0].roomType.price,
                    roomId: availableMatchingRooms[0].id,
                });
            }
        });

        return reply.code(201).send(booking);
    } catch (e) {
        return reply.badRequest(errorMessage(e));
    }
}
