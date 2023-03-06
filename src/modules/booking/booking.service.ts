import { prisma } from "../../plugins/prisma";
import { CreateBookingInput } from "./booking.schema";
import { getUserById } from "../auth/auth.service";

export async function getAllBookings() {
    return await prisma.booking.findMany();
}

export async function createBooking(input: CreateBookingInput, userId: number) {
    const user = await getUserById(userId);

    if (!user) {
        throw Error("Could not find user with id: " + userId);
    }

    return await prisma.booking.create({
        data: {
            userId: user.id,
            start: input.start,
            end: input.end,
        },
    });
}
