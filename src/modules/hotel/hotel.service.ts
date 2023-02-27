import { prisma } from "../../plugins/prisma";
import { CreateHotelInput, UpdateHotelInput } from "./hotel.schema";
import { idNotFound } from "./hotel.errors";

export async function getAllHotels() {
    return await prisma.hotel.findMany();
}

export async function createHotel(input: CreateHotelInput) {
    return await prisma.hotel.create({
        data: {
            name: input.name,
            description: input.description,
            address: input.address,
        },
    });
}

export async function updateHotel(input: UpdateHotelInput) {
    try {
        const hotel = await prisma.hotel.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                description: input.description,
                address: input.address,
            },
        });

        return hotel;
    } catch (e) {
        throw idNotFound(input.id);
    }
}

export async function deleteHotel(id: number) {
    try {
        return await prisma.hotel.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getHotelById(id: number) {
    const hotel = await prisma.hotel.findFirst({
        where: { id: id },
    });

    if (!hotel) {
        throw idNotFound(id);
    }

    return hotel;
}
