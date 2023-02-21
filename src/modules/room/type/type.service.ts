import { prisma } from "../../../plugins/prisma";
import {
    CreateRoomTypeInput,
    UpdateRoomTypeInput
} from "./type.schema";
import { showHotel } from "../../hotel/hotel.service";
import { idNotFound } from "./type.errors";

export async function createRoomType(input: CreateRoomTypeInput) {
    // Only using it's thrown error.
    await showHotel(input.hotel_id);

    const roomType = await prisma.roomType.create({
        data: {
            name: input.name,
            description: input.description,
            size: input.size,
            price: input.price,
            hotel_id: input.hotel_id,
        },
    });

    return roomType;
}

export async function browseRoomType() {
    return await prisma.roomType.findMany();
}

export async function showRoomType(id: number) {
    const roomType = await findRoomTypeById(id);
    if (!roomType) {
        return idNotFound(id);
    }

    return roomType;
}

export async function updateRoomType(input: UpdateRoomTypeInput) {
    // Only using it's thrown error.
    await showHotel(input.hotel_id);

    try {
        const roomType = await prisma.roomType.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                description: input.description,
                size: input.size,
                price: input.price,
                hotel_id: input.hotel_id,
            }
        })

        return roomType;
    } catch (e) {
        return idNotFound(input.id);
    }
}

export async function deleteRoomType(id: number) {
    try {
        return await prisma.roomType.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        return idNotFound(id);
    }
}

export async function findRoomTypeById(id: number) {
    return await prisma.roomType.findFirst({
        where: { id: id },
    });
}

export async function findRoomTypeByHotelId(id: number) {
    return await prisma.roomType.findMany({
        where: { hotel_id: id },
    });
}