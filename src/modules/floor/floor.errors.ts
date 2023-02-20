export async function error_message(e: unknown) {
    let message = String(e);

    if (e instanceof Error) {
        message = e.message;
    }

    return message;
}

export async function id_not_found(id: number) {
    throw Error("Could not find floor with id: " + id);
}