import { prisma } from "../../plugins/prisma";
import {
    CreateHotelInput,
    UpdateHotelInput
} from "./hotel.schema";
import { idNotFound } from "./hotel.errors";

export async function createHotel(input: CreateHotelInput) {
    const hotel = await prisma.hotel.create({
        data: {
            name: input.name,
            description: input.description,
            address: input.address,
        },
    });

    return hotel;
}

export async function browseHotel() {
    return await prisma.hotel.findMany();
}

export async function showHotel(id: number) {
    const hotel = await findHotelById(id);
    if (!hotel) {
        return idNotFound(id);
    }

    return hotel;
}

export async function updateHotel(input: UpdateHotelInput) {
    try {
        const hotel = await prisma.hotel.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                description: input.description,
                address: input.address
            }
        })

        return hotel;
    } catch (e) {
        return idNotFound(input.id);
    }
}

export async function deleteHotel(id: number) {
    try {
        return await prisma.hotel.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        return idNotFound(id);
    }
}


export async function findHotelById(id: number) {
    return await prisma.hotel.findFirst({
        where: { id: id },
    });
}