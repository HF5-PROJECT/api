export function idNotFound(id: number) {
    return Error("Could not find room type with id: " + id);
}
