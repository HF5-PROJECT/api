import { prisma } from "../../plugins/prisma";
import { CreateFloorInput, UpdateFloorInput } from "./floor.schema";
import { getHotelById } from "../hotel/hotel.service";
import { hotelIdWithNumberUniqueConstraint, idNotFound } from "./floor.errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getAllFloors() {
    return await prisma.floor.findMany();
}

export async function createFloor(input: CreateFloorInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.floor.create({
            data: {
                number: input.number,
                hotelId: hotel.id,
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw hotelIdWithNumberUniqueConstraint()
            }
        }

        return e;
    }
}

export async function updateFloor(input: UpdateFloorInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.floor.update({
            where: {
                id: input.id,
            },
            data: {
                number: input.number,
                hotelId: hotel.id,
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw hotelIdWithNumberUniqueConstraint()
            }
        }

        throw idNotFound(input.id);
    }
}

export async function deleteFloor(id: number) {
    try {
        return await prisma.floor.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getFloorById(id: number) {
    const floor = await prisma.floor.findFirst({
        where: { id: id },
    });

    if (!floor) {
        throw idNotFound(id);
    }

    return floor;
}

export async function getFloorsByHotelId(hotelId: number) {
    const hotel = await getHotelById(hotelId);

    return await prisma.floor.findMany({
        where: {
            hotelId: hotel.id,
        },
    });
}
