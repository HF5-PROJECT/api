export function idNotFound(id: number) {
    return Error("Could not find hotel with id: " + id);
}

export function nameUniqueConstraint() {
    return Error("This name is already in use");
}