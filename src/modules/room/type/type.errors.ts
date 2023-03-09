export function idNotFound(id: number) {
    return Error("Could not find room type with id: " + id);
}

export function idsNotFound(ids: number[]) {
    return Error(
        "Could not find room type(s) with ids: " + JSON.stringify(ids)
    );
}

export function hotelIdWithNameUniqueConstraint() {
    return Error("This room type name already exists in this hotel");
}
