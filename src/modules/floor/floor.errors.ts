export async function errorMessage(e: unknown) {
    let message = String(e);

    if (e instanceof Error) {
        message = e.message;
    }

    return message;
}

export async function idNotFound(id: number) {
    throw Error("Could not find floor with id: " + id);
}