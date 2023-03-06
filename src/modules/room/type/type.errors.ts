export function idNotFound(id: number) {
    return Error("Could not find room type with id: " + id);
}

export function idsNotFound(ids: number[]) {
    return Error(
        "Could not find room type(s) with ids: " + JSON.stringify(ids)
    );
}
