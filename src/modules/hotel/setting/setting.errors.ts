export function idNotFound(id: number) {
    return Error("Could not find hotel setting with id: " + id);
}
