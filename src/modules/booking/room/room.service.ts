import { RoomType } from "@prisma/client";
import { prisma } from "../../../plugins/prisma";

export async function getAllBookingRooms() {
    return await prisma.bookingRoom.findMany();
}

export async function getAvailableRoomsByRoomTypesAndDateInterval(
    roomTypes: RoomType[],
    start: Date,
    end: Date
) {
    return await prisma.room.findMany({
        where: {
            roomTypeId: {
                in: roomTypes.map((roomType) => roomType.id),
            },
            BookingRoom: {
                none: {
                    booking: {
                        start: {
                            lte: end,
                        },
                        end: {
                            gte: start,
                        },
                    },
                },
            },
        },
    });
}
