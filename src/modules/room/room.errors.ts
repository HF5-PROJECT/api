export function idNotFound(id: number) {
    return Error("Could not find room with id: " + id);
}
