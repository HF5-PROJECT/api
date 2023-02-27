import { prisma } from "../../plugins/prisma";
import { CreateRoomInput, UpdateRoomInput } from "./room.schema";
import { getFloorById } from "../floor/floor.service";
import { getRoomTypeById } from "./type/type.service";
import { idNotFound } from "./room.errors";

export async function createRoom(input: CreateRoomInput) {
    const floor = await getFloorById(input.floorId);
    const roomType = await getRoomTypeById(input.roomTypeId);

    return await prisma.room.create({
        data: {
            number: input.number,
            floorId: floor.id,
            roomTypeId: roomType.id,
        },
    });
}

export async function getAllRooms() {
    return await prisma.room.findMany();
}

export async function updateRoom(input: UpdateRoomInput) {
    const floor = await getFloorById(input.floorId);
    const roomType = await getRoomTypeById(input.roomTypeId);

    try {
        return await prisma.room.update({
            where: {
                id: input.id,
            },
            data: {
                number: input.number,
                floorId: floor.id,
                roomTypeId: roomType.id,
            },
        });
    } catch (e) {
        throw idNotFound(input.id);
    }
}

export async function deleteRoom(id: number) {
    try {
        return await prisma.room.delete({
            where: {
                id: id,
            },
        });
    } catch (e) {
        throw idNotFound(id);
    }
}

export async function getRoomById(id: number) {
    const room = await prisma.room.findFirst({
        where: { id: id },
    });

    if (!room) {
        throw idNotFound(id);
    }

    return room;
}

export async function getRoomsByFloorId(floorId: number) {
    const floor = await getFloorById(floorId);

    return await prisma.room.findMany({
        where: {
            floorId: floor.id,
        },
    });
}

export async function getRoomsByRoomTypeId(roomTypeId: number) {
    const roomType = await getRoomTypeById(roomTypeId);

    return await prisma.room.findMany({
        where: {
            roomTypeId: roomType.id,
        },
    });
}
