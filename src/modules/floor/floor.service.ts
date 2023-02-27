import { prisma } from "../../plugins/prisma";
import {
    CreateFloorInput,
    UpdateFloorInput
} from "./floor.schema";
import { findHotelById } from "../hotel/hotel.service";
import { idNotFound } from "./floor.errors";
import { findRoomByFloorId } from "../room/room.service";

export async function createFloor(input: CreateFloorInput) {
    const hotel = await findHotelById(input.hotelId);

    const floor = await prisma.floor.create({
        data: {
            number: input.number,
            hotelId: hotel.id,
        },
    });

    return floor;
}

export async function browseFloor() {
    return await prisma.floor.findMany();
}

export async function showFloor(id: number) {
    return await findFloorById(id);
}

export async function updateFloor(input: UpdateFloorInput) {
    const hotel = await findHotelById(input.hotelId);

    try {
        const floor = await prisma.floor.update({
            where: {
                id: input.id
            },
            data: {
                number: input.number,
                hotelId: hotel.id,
            }
        })

        return floor;
    } catch (e) {
        throw idNotFound(input.id);
    }
}

export async function deleteFloor(id: number) {
    try {
        return await prisma.floor.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function showFloorRooms(id: number) {
    const floor = await findFloorById(id);

    return findRoomByFloorId(floor.id);
}

export async function findFloorById(id: number) {
    const floor = await prisma.floor.findFirst({
        where: { id: id },
    });

    if (!floor) {
        throw idNotFound(id);
    }

    return floor;
}

export async function findFloorByHotelId(hotelId: number) {
    return await prisma.floor.findMany({
        where: {
            hotelId: hotelId
        }
    });
}