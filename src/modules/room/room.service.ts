import { prisma } from "../../plugins/prisma";
import {
    CreateRoomInput,
    UpdateRoomInput
} from "./room.schema";
import { findFloorById } from "../floor/floor.service";
import { findRoomTypeById } from "./type/type.service";
import { idNotFound } from "./room.errors";

export async function createRoom(input: CreateRoomInput) {
    const floor = await findFloorById(input.floorId);
    const roomType = await findRoomTypeById(input.roomTypeId);

    const room = await prisma.room.create({
        data: {
            number: input.number,
            floorId: floor.id,
            roomTypeId: roomType.id,
        },
    });

    return room;
}

export async function browseRoom() {
    return await prisma.room.findMany();
}

export async function showRoom(id: number) {
    return await findRoomById(id);
}

export async function updateRoom(input: UpdateRoomInput) {
    const floor = await findFloorById(input.floorId);
    const roomType = await findRoomTypeById(input.roomTypeId);

    try {
        const room = await prisma.room.update({
            where: {
                id: input.id
            },
            data: {
                number: input.number,
                floorId: floor.id,
                roomTypeId: roomType.id,
            }
        })

        return room;
    } catch (e) {
        throw idNotFound(input.id);
    }
}

export async function deleteRoom(id: number) {
    try {
        return await prisma.room.delete({
            where: {
                id: id
            }
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function findRoomById(id: number) {
    const room = await prisma.room.findFirst({
        where: { id: id },
    });

    if (!room) {
        throw idNotFound(id);
    }

    return room;
}

export async function findRoomByFloorId(floorId: number) {
    return await prisma.room.findMany({
        where: {
            floorId: floorId
        }
    });
}

export async function findRoomByRoomTypeId(roomTypeId: number) {
    return await prisma.room.findMany({
        where: {
            roomTypeId: roomTypeId
        }
    });
}