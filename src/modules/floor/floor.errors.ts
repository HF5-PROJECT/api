export function idNotFound(id: number) {
    return Error("Could not find floor with id: " + id);
}

export function hotelIdWithNumberUniqueConstraint() {
    return Error("This floor number already exists in this hotel");
}