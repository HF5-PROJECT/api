export function idNotFound(id: number) {
    return Error("Could not find floor with id: " + id);
}
