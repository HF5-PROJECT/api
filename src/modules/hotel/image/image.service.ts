import { prisma } from "../../../plugins/prisma";
import {
    CreateImageInput
} from "./image.schema";
import { id_not_found } from "./image.errors";

export async function createImage(input: CreateImageInput) {
    const hotel = await prisma.hotelImages.create({
        data: {
            path: input.path,
            order: input.order,
            hotel_id: input.hotel_id,
        },
    });

    return hotel;
}

export async function browseImage() {
    return await prisma.hotelImages.findMany();
}

export async function showImage(id: number) {
    const hotel = await findImageById(id);
    if (!hotel) {
        return id_not_found(id);
    }

    return hotel;
}

export async function deleteImage(id: number) {
    try {
        return await prisma.hotel.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        return id_not_found(id);
    }
}


export async function findImageById(id: number) {
    return await prisma.hotelImages.findFirst({
        where: { id: id },
    });
}