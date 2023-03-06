import { prisma } from "../../../plugins/prisma";
import { CreateHotelSettingInput, UpdateHotelSettingInput } from "./setting.schema";
import { getHotelById } from "../hotel.service";
import { idNotFound } from "./setting.errors";

export async function getAllHotelSettings() {
    return await prisma.hotelSetting.findMany();
}

export async function createHotelSetting(input: CreateHotelSettingInput) {
    const hotel = await getHotelById(input.hotelId);

    return await prisma.hotelSetting.create({
        data: {
            key: input.key,
            value: input.value,
            hotelId: hotel.id,
        },
    });
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
