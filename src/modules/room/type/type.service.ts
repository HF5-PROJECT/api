import { prisma } from "../../../plugins/prisma";
import {
    CreateRoomTypeInput,
    UpdateRoomTypeInput
} from "./type.schema";
import { findHotelById } from "../../hotel/hotel.service";
import { idNotFound } from "./type.errors";

export async function createRoomType(input: CreateRoomTypeInput) {
    const hotel = await findHotelById(input.hotelId);

    const roomType = await prisma.roomType.create({
        data: {
            name: input.name,
            description: input.description,
            size: input.size,
            price: input.price,
            hotelId: hotel.id,
        },
    });

    return roomType;
}

export async function browseRoomType() {
    return await prisma.roomType.findMany();
}

export async function showRoomType(id: number) {
    return await findRoomTypeById(id);
}

export async function updateRoomType(input: UpdateRoomTypeInput) {
    const hotel = await findHotelById(input.hotelId);

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
                hotelId: hotel.id,
            }
        })

        return roomType;
    } catch (e) {
        throw idNotFound(input.id);
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
        throw idNotFound(id);
    }
}

export async function findRoomTypeById(id: number) {
    const roomType = await prisma.roomType.findFirst({
        where: { id: id },
    });

    if (!roomType) {
        throw idNotFound(id);
    }

    return roomType;
}

export async function findRoomTypeByHotelId(id: number) {
    return await prisma.roomType.findMany({
        where: { hotelId: id },
    });
}