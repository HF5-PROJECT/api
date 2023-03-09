export function idNotFound(id: number) {
    return Error("Could not find room with id: " + id);
}

export function floorIdWithNumberUniqueConstraint() {
    return Error("This room number already exists on this floor");
}
