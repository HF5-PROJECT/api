export function idNotFound(id: number) {
    return Error("Could not find hotel information with id: " + id);
}
