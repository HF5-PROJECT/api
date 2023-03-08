export function idNotFound(id: number) {
    return Error("Could not find hotel setting with id: " + id);
}

export function hotelIdWithKeyUniqueConstraint() {
    return Error("This HotelSetting key already exists in this hotel");
}
