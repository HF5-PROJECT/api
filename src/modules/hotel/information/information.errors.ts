export function idNotFound(id: number) {
    return Error("Could not find hotel information with id: " + id);
}

export function hotelIdWithKeyUniqueConstraint() {
    return Error("This HotelInformation key already exists in this hotel");
}