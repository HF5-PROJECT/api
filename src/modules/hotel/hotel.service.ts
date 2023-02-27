import { prisma } from "../../plugins/prisma";
import {
    CreateHotelInput,
    UpdateHotelInput
} from "./hotel.schema";
import { findFloorByHotelId } from "../floor/floor.service"
import { findRoomTypeByHotelId } from "../room/type/type.service";
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
    return await findHotelById(id);
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
        throw idNotFound(input.id);
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
        throw idNotFound(id);
    }
}

export async function showHotelFloors(id: number) {
    const hotel = await findHotelById(id);

    return findFloorByHotelId(hotel.id);
}

export async function showHotelRoomTypes(id: number) {
    const hotel = await findHotelById(id);

    return findRoomTypeByHotelId(hotel.id);
}

export async function findHotelById(id: number) {
    const hotel = await prisma.hotel.findFirst({
        where: { id: id },
    });

    if (!hotel) {
        throw idNotFound(id);
    }

    return hotel
}