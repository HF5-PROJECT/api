export function idNotFound(id: number) {
    return Error("Could not find hotel with id: " + id);
}
