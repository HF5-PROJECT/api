import { prisma } from "../../../plugins/prisma";
import { CreateHotelSettingInput, UpdateHotelSettingInput } from "./setting.schema";
import { getHotelById } from "../hotel.service";
import { hotelIdWithKeyUniqueConstraint, idNotFound } from "./setting.errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getAllHotelSettings() {
    return await prisma.hotelSetting.findMany();
}

export async function createHotelSetting(input: CreateHotelSettingInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.hotelSetting.create({
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

export async function updateHotelSetting(input: UpdateHotelSettingInput) {
    const hotel = await getHotelById(input.hotelId);

    try {
        return await prisma.hotelSetting.update({
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

export async function deleteHotelSetting(id: number) {
    try {
        return await prisma.hotelSetting.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getHotelSettingById(id: number) {
    const hotelSetting = await prisma.hotelSetting.findFirst({
        where: { id: id },
    });

    if (!hotelSetting) {
        throw idNotFound(id);
    }

    return hotelSetting;
}

export async function getHotelSettingsByHotelId(hotelId: number) {
    const hotel = await getHotelById(hotelId);

    return await prisma.hotelSetting.findMany({
        where: {
            hotelId: hotel.id,
        },
    });
}
