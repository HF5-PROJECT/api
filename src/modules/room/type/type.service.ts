import { prisma } from "../../../plugins/prisma";
import {
    CreateRoomTypeInput,
    UpdateRoomTypeInput
} from "./type.schema";
import { id_not_found } from "./type.errors";

export async function createRoomType(input: CreateRoomTypeInput) {
    const RoomType = await prisma.roomType.create({
        data: {
            name: input.name,
            description: input.description,
            size: input.size,
            price: input.price,
            hotel_id: input.hotel_id,
        },
    });

    return RoomType;
}

export async function browseRoomType() {
    return await prisma.roomType.findMany();
}

export async function showRoomType(id: number) {
    const RoomType = await findRoomTypeById(id);
    if (!RoomType) {
        return id_not_found(id);
    }

    return RoomType;
}

export async function updateRoomType(input: UpdateRoomTypeInput) {
    try {
        const new_RoomType = await prisma.roomType.update({
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

        return new_RoomType;
    } catch (e) {
        return id_not_found(input.id);
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
        return id_not_found(id);
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