export function idNotFound(id: number) {
    return Error("Could not find permission with id: " + id);
}
