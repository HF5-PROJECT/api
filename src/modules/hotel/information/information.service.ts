import { prisma } from "../../../plugins/prisma";
import { CreateHotelInformationInput, UpdateHotelInformationInput } from "./information.schema";
import { getHotelById } from "../hotel.service";
import { hotelIdWithKeyUniqueConstraint, idNotFound } from "./information.errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getAllHotelInformations() {
    return await prisma.hotelInformation.findMany();
}

export async function createHotelInformation(input: CreateHotelInformationInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.hotelInformation.create({
            data: {
                key: input.key,
                value: input.value,
                hotelId: hotel.id,
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw hotelIdWithKeyUniqueConstraint()
            }
        }

        throw e;
    }
}

export async function updateHotelInformation(input: UpdateHotelInformationInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.hotelInformation.update({
            where: {
                id: input.id,
            },
            data: {
                key: input.key,
                value: input.value,
                hotelId: hotel.id,
            },
        });
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw hotelIdWithKeyUniqueConstraint()
            }
        }

        throw idNotFound(input.id);
    }
}

export async function deleteHotelInformation(id: number) {
    try {
        return await prisma.hotelInformation.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getHotelInformationById(id: number) {
    const hotelInformation = await prisma.hotelInformation.findFirst({
        where: { id: id },
    });

    if (!hotelInformation) {
        throw idNotFound(id);
    }

    return hotelInformation;
}

export async function getHotelInformationsByHotelId(hotelId: number) {
    const hotel = await getHotelById(hotelId);

    return await prisma.hotelInformation.findMany({
        where: {
            hotelId: hotel.id,
        },
    });
}
