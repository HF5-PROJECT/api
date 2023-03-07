import { prisma } from "../../../plugins/prisma";
import { CreateRoomTypeInput, UpdateRoomTypeInput } from "./type.schema";
import { getHotelById } from "../../hotel/hotel.service";
import { idNotFound, idsNotFound } from "./type.errors";

export async function getAllRoomTypes() {
    return await prisma.roomType.findMany();
}

export async function createRoomType(input: CreateRoomTypeInput) {
    const hotel = await getHotelById(input.hotelId);

    return await prisma.roomType.create({
        data: {
            name: input.name,
            description: input.description,
            size: input.size,
            supportedPeople: input.supportedPeople,
            price: input.price,
            hotelId: hotel.id,
        },
    });
}

export async function updateRoomType(input: UpdateRoomTypeInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.roomType.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                description: input.description,
                size: input.size,
                supportedPeople: input.supportedPeople,
                price: input.price,
                hotelId: hotel.id,
            },
        });
    } catch (e) {
        throw idNotFound(input.id);
    }
}

export async function deleteRoomType(id: number) {
    try {
        return await prisma.roomType.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getRoomTypeById(id: number) {
    const roomType = await prisma.roomType.findFirst({
        where: { id: id },
    });

    if (!roomType) {
        throw idNotFound(id);
    }

    return roomType;
}

export async function getRoomTypesByIds(ids: number[]) {
    const roomTypes = await prisma.roomType.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    const missingIds = ids.filter((roomTypeId) => {
        return (
            roomTypes.find((roomType) => roomType.id === roomTypeId) ===
            undefined
        );
    });

    if (missingIds.length !== 0) {
        throw idsNotFound(missingIds);
    }

    return roomTypes;
}

export async function getRoomTypesByHotelId(hotelId: number) {
    const hotel = await getHotelById(hotelId);

    return await prisma.roomType.findMany({
        where: { hotelId: hotel.id },
    });
}
