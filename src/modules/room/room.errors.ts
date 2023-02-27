export async function errorMessage(e: unknown) {
    let message = String(e);

    if (e instanceof Error) {
        message = e.message;
    }

    return message;
}

export function idNotFound(id: number) {
    return Error("Could not find room with id: " + id);
}