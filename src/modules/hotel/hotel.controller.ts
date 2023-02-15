import { FastifyReply, FastifyRequest } from "fastify";
import {
    createHotel,
    browseHotel,
    showHotel,
    updateHotel,
    deleteHotel
} from "./hotel.service";
import {
    CreateHotelInput,
    UpdateHotelInput,
    ShowHotelParams,
    DeleteHotelParams
} from "./hotel.schema";
import { error_message } from "./hotel.errors";

export async function createHotelHandler(
    request: FastifyRequest<{
        Body: CreateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await createHotel(request.body);

        reply.code(201).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function browseHotelHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const hotels = await browseHotel();

        reply.code(200).send(hotels);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function showHotelHandler(
    request: FastifyRequest<{
        Params: ShowHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await showHotel(Number(request.params.id));

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function updateHotelHandler(
    request: FastifyRequest<{
        Body: UpdateHotelInput;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await updateHotel(request.body);

        reply.code(200).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}

export async function deleteHotelHandler(
    request: FastifyRequest<{
        Params: DeleteHotelParams;
    }>,
    reply: FastifyReply
) {
    try {
        const hotel = await deleteHotel(Number(request.params.id));

        reply.code(204).send(hotel);
    } catch (e) {
        return reply.badRequest(await error_message(e));
    }
}