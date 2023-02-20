import { prisma } from "../../plugins/prisma";
import {
    CreateFloorInput,
    UpdateFloorInput
} from "./floor.schema";
import { id_not_found } from "./floor.errors";

export async function createFloor(input: CreateFloorInput) {
    const floor = await prisma.floor.create({
        data: {
            number: input.number,
            hotelId: input.hotelId,
        },
    });

    return floor;
}

export async function browseFloor() {
    return await prisma.floor.findMany();
}

export async function showFloor(id: number) {
    const floor = await findFloorById(id);
    if (!floor) {
        return id_not_found(id);
    }

    return floor;
}

export async function updateFloor(input: UpdateFloorInput) {
    try {
        const new_floor = await prisma.floor.update({
            where: {
                id: input.id
            },
            data: {
                number: input.number,
                hotelId: input.hotelId,
            }
        })

        return new_floor;
    } catch (e) {
        return id_not_found(input.id);
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
        return id_not_found(id);
    }
}

export async function findFloorById(id: number) {
    return await prisma.floor.findFirst({
        where: { id: id },
    });
}

export async function findFloorByHotelId(id: number) {
    return await prisma.floor.findMany({
        where: {
            hotelId: id
        }
    });
}