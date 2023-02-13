import { hashSync } from "bcrypt";
import { prisma } from "../../plugins/prisma";
import { CreateUserInput } from "./auth.schema";

export async function createUser(input: CreateUserInput) {
    if (await findUserByEmail(input.email)) {
        throw Error("Email is already in use");
    }

    const user = await prisma.user.create({
        data: {
            email: input.email,
            password: hashSync(input.password, 10),
            name: input.name,
            address: input.address,
        },
    });

    return user;
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findFirst({
        where: { email: email },
    });
}

export async function findUserById(id: number) {
    return await prisma.user.findFirst({
        where: { id: id },
    });
}
