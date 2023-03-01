import { Floor, Hotel, Permission, PrismaClient, Role, Room, RoomType, User } from '@prisma/client'
import { number } from 'zod';
const prisma = new PrismaClient()
async function main() {
    /**
     * Define array variables
     */
    let permissions: Permission[] = [];
    let users: User[] = [];
    let roles: Role[] = [];
    let hotels: Hotel[] = [];
    let floors: Floor[][] = [];
    let roomTypes: RoomType[][] = [];

    /**
     * Permission upserts
     */
    const hotelCreatePermission = await addPermission('Hotel Create');
    const hotelUpdatePermission = await addPermission('Hotel Update');
    const hotelDeletePermission = await addPermission('Hotel Delete');
    const hotelFloorsGetAllPermission = await addPermission('Hotel-Floors GetAll');

    const floorGetAllPermission = await addPermission('Floor GetAll');
    const floorGetPermission = await addPermission('Floor Get');
    const floorCreatePermission = await addPermission('Floor Create');
    const floorUpdatePermission = await addPermission('Floor Update');
    const floorDeletePermission = await addPermission('Floor Delete');
    const floorRoomsGetAllPermission = await addPermission('Floor-Rooms GetAll');

    const roomTypeCreatePermission = await addPermission('RoomType Create');
    const roomTypeUpdatePermission = await addPermission('RoomType Update');
    const roomTypeDeletePermission = await addPermission('RoomType Delete');
    const roomTypeRoomsGetAllPermission = await addPermission('RoomType-Rooms GetAll');

    const roomGetAllPermission = await addPermission('Room GetAll');
    const roomGetPermission = await addPermission('Room Get');
    const roomCreatePermission = await addPermission('Room Create');
    const roomUpdatePermission = await addPermission('Room Update');
    const roomDeletePermission = await addPermission('Room Delete');

    const swaggerPermission = await addPermission('Swagger');

    const receptionistPermissions: Permission[] = [hotelFloorsGetAllPermission, floorGetAllPermission, floorGetPermission, floorRoomsGetAllPermission, roomGetAllPermission, roomGetPermission, roomTypeRoomsGetAllPermission];
    const supporterPermissions: Permission[] = [...receptionistPermissions];
    const branchManagerPermissions: Permission[] = [...supporterPermissions, hotelUpdatePermission, floorUpdatePermission, roomTypeUpdatePermission, roomUpdatePermission];
    const seniorManagerPermissions: Permission[] = [...branchManagerPermissions, floorCreatePermission, roomCreatePermission, roomTypeCreatePermission];
    const administatorPermissions: Permission[] = [...seniorManagerPermissions, hotelCreatePermission, hotelDeletePermission, floorDeletePermission, roomTypeDeletePermission, roomDeletePermission];
    const developerAdministatorPermissions: Permission[] = [...administatorPermissions, swaggerPermission];
    permissions.push(...developerAdministatorPermissions);

    /**
     * Roles upserts
     */
    const receptionistRole = await addRole('Receptionist', receptionistPermissions);
    const supporterRole = await addRole('Supporter', supporterPermissions);
    const branchManagerRole = await addRole('Branch Manager', branchManagerPermissions);
    const seniorManagerRole = await addRole('Senior Manager', seniorManagerPermissions);
    const administatorRole = await addRole('Administator', administatorPermissions);
    const developerAdministatorRole = await addRole('Developer Administator', developerAdministatorPermissions);
    roles.push(receptionistRole, supporterRole, branchManagerRole, seniorManagerRole, administatorRole, developerAdministatorRole);

    /**
     * Users upserts
     * All passwords are 12345678
     */
    const normalUser = await addUser(
        'Normal User',
        'normal@overnites.binau.dev',
        []
    );
    const receptionistUser = await addUser(
        'Receptionist User',
        'receptionist@overnites.binau.dev',
        [receptionistRole]
    );
    const supporterUser = await addUser(
        'Supporter User',
        'supporter@overnites.binau.dev',
        [supporterRole]
    );
    const branchManagerUser = await addUser(
        'Branch Manager User',
        'branch-manager@overnites.binau.dev',
        [branchManagerRole]
    );
    const seniorManagerUser = await addUser(
        'Senior Manager User',
        'senior-manager@overnites.binau.dev',
        [seniorManagerRole]
    );
    const administatorUser = await addUser(
        'administator User',
        'administator@overnites.binau.dev',
        [administatorRole]
    );
    const developerAdministatorUser = await addUser(
        'Developer Administator User',
        'developer-administator@overnites.binau.dev',
        [developerAdministatorRole]
    );
    users.push(normalUser, receptionistUser, supporterUser, branchManagerUser, seniorManagerUser, administatorUser, developerAdministatorUser);

    /**
     * Hotel upserts
     */
    const copenhagenHotel = await addHotel(
        'Overnites: Hagen',
        'A superb location with friendly and helpful staff. The hostel offers comfortable, clean rooms and fantastic access to Copenhagen most famous sights and attractions',
        'Københavnvej 13, 1100 København',
    );
    const odenseHotel = await addHotel(
        'Overnites: Odense',
        'Our hotel is easily accessible from the E45 motorway and it is designed to satisfy the needs of even the most demanding customers, be they holiday-makers or businesspeople.',
        'Hibiscusvej 20, 5200 Odense V',
    );
    const aarhusHotel = await addHotel(
        'Overnites: Aarhus',
        'A luxury hotel located in the heart of Aarhus.',
        'Mangepengevej 210, 2100 Aarhus',
    );
    hotels.push(copenhagenHotel, odenseHotel, aarhusHotel);

    /**
     * Floor upserts
     */
    const copenhagenFloors = await addFloors(copenhagenHotel, 51);
    const odenseFloors = await addFloors(odenseHotel, 5);
    const aarhusFloors = await addFloors(aarhusHotel, 13);
    floors.push(copenhagenFloors, odenseFloors, aarhusFloors);

    /**
     * Room Type upserts
     */
    const copenhagenRoomTypes = await Promise.all([
        addRoomTypes(
            copenhagenHotel,
            'Double room',
            'Our double rooms are for two people with their own toilet and bathroom. The double bed has a luxurious mattress from Getama and is equipped with a TV.',
            '9 m2',
            250.50,
            2,
        ),
        addRoomTypes(
            copenhagenHotel,
            'Single room',
            'The single room has a bed with a luxurious Getama mattress and its own toilet and shower. All single rooms are equipped with a TV. The room is perfect for you who wish to stay alone and yet make use of all the facilities. ',
            '9 m2',
            250.50,
            1,
        ),
        addRoomTypes(
            copenhagenHotel,
            'Twin room for 1 or 2 persons',
            'Twin Room is perfect for two friends who travel together but doesn’t want to share the same bed. The beds have luxurious mattresses from Getama, as well as a private toilet and bathroom. The room can only be booked as a private room or a room for one person.',
            '12 m2',
            350.50,
            2,
        ),
        addRoomTypes(
            copenhagenHotel,
            '4-bed dorms',
            'The dorms are equipped with luxurious mattresses from Getama, as well as a private toilet and shower. Furthermore, you have access to a locker where you can store your private belongings. Book the required number of beds or book it as a private room if you are a group travelling together.',
            '9 m2',
            250.50,
            4,
        ),
        addRoomTypes(
            copenhagenHotel,
            '6-bed dorms',
            'The dorms are equipped with luxurious mattresses from Getama, as well as a private toilet and shower. Furthermore, you have access to a locker where you can store your private belongings. Book the required number of beds or book it as a private room if you are a group travelling together.',
            '12 m2',
            350.50,
            6,
        ),
    ]);
    const odenseRoomTypes = await Promise.all([
        addRoomTypes(
            odenseHotel,
            'Single room',
            'Our single rooms contain a bed with a luxurious Getama mattress, private toilet/bathroom and space to store your clothes and belongings. In addition, all single rooms are equipped with a TV. The room is perfect for guests wishing to stay alone and yet make use of the shared facilities',
            '9 m2',
            250.50,
            1,
        ),
        addRoomTypes(
            odenseHotel,
            'Single room with a terrace',
            'Our single rooms contain a bed with a luxurious Getama mattress, private toilet/bathroom and space to store your clothes and belongings. In addition, all single rooms are equipped with a TV. The room is perfect for guests wishing to stay alone and yet make use of the shared facilities',
            '12 m2',
            300.50,
            1,
        ),
        addRoomTypes(
            odenseHotel,
            'Double room',
            'You get a nice room for 2 people, a double bed with a luxurious Getama mattress, private toilet/bathroom and space to store your clothes and belongings. In addition, all double rooms are equipped with a TV. Book this double room if you would like a private room that sleeps two.',
            '9 m2',
            250.50,
            2,
        ),
        addRoomTypes(
            odenseHotel,
            'Double room with a terrace',
            'You get a nice room for 2 people, a double bed with a luxurious Getama mattress, private toilet/bathroom and space to store your clothes and belongings. In addition, all double rooms are equipped with a TV. Book this double room if you would like a private room that sleeps two.',
            '12 m2',
            300.50,
            2,
        ),
        addRoomTypes(
            odenseHotel,
            'TWIN ROOM for 1 or 2 Persons',
            'Perfect for 2 friends who wants to stay together, but not in the same bed! Our twin rooms have single beds, a private toilet/bathroom and can only be booked privately. Choose this room if you want a private room with your friend, but don’t want to share your bed. Traveling on your own? Don’t worry; this room can also be booked as a private single room.',
            '17 m2',
            400.50,
            2,
        ),
    ]);

    const aarhusRoomTypes = await Promise.all([
        addRoomTypes(
            aarhusHotel,
            'Double room',
            'Our double rooms are for two people with their own toilet and bathroom. The double bed has a luxurious mattress from Getama and is equipped with a TV.',
            '9 m2',
            250.50,
            2,
        ),
        addRoomTypes(
            aarhusHotel,
            'Single room',
            'The single room has a bed with a luxurious Getama mattress and its own toilet and shower. All single rooms are equipped with a TV. The room is perfect for you who wish to stay alone and yet make use of all the facilities. ',
            '9 m2',
            250.50,
            1,
        ),
        addRoomTypes(
            aarhusHotel,
            'Twin room for 1 or 2 persons',
            'Twin Room is perfect for two friends who travel together but doesn’t want to share the same bed. The beds have luxurious mattresses from Getama, as well as a private toilet and bathroom. The room can only be booked as a private room or a room for one person.',
            '12 m2',
            350.50,
            2,
        ),
        addRoomTypes(
            aarhusHotel,
            '4-bed dorms',
            'The dorms are equipped with luxurious mattresses from Getama, as well as a private toilet and shower. Furthermore, you have access to a locker where you can store your private belongings. Book the required number of beds or book it as a private room if you are a group travelling together.',
            '9 m2',
            250.50,
            4,
        ),
        addRoomTypes(
            aarhusHotel,
            '6-bed dorms',
            'The dorms are equipped with luxurious mattresses from Getama, as well as a private toilet and shower. Furthermore, you have access to a locker where you can store your private belongings. Book the required number of beds or book it as a private room if you are a group travelling together.',
            '12 m2',
            350.50,
            6,
        ),
    ]);
    roomTypes.push(copenhagenRoomTypes, odenseRoomTypes, aarhusRoomTypes);

    /**
     * Rooms upserts
     */
    Promise.all([
        addRooms(copenhagenHotel, copenhagenFloors, copenhagenRoomTypes, 6000),
        addRooms(odenseHotel, odenseFloors, odenseRoomTypes, 1500),
        addRooms(aarhusHotel, aarhusFloors, aarhusRoomTypes, 2500)
    ]);
}

async function addPermission(name: string): Promise<Permission> {
    return await prisma.permission.upsert({
        where: { name: name },
        update: {},
        create: {
            name: name,
        },
    });
}

async function addRole(name: string, permissions: Permission[]): Promise<Role> {
    const parsedPermissions = permissions.map(permission => {
        return {
            permission: {
                connect: { id: permission.id }
            },
        }
    });

    return await prisma.role.upsert({
        where: { name: name },
        update: {
            permissions: {
                create: parsedPermissions,
            }
        },
        create: {
            name: name,
            permissions: {
                create: parsedPermissions,
            }
        },
    });
}

async function addUser(name: string, email: string, roles: Role[]): Promise<User> {
    const parsedRoles = roles.map(role => {
        return {
            role: {
                connect: { id: role.id }
            },
        }
    });

    return await prisma.user.upsert({
        where: { email: email },
        update: {
            name: name,
            password: '$2b$10$4cYGVnrLrgbuU5gIiCHE1OhBcwDJATdzBfe9yj5rIFXrH52J8.m9C', // 12345678
            roles: {
                create: parsedRoles,
            }
        },
        create: {
            email: email,
            name: name,
            password: '$2b$10$4cYGVnrLrgbuU5gIiCHE1OhBcwDJATdzBfe9yj5rIFXrH52J8.m9C', // 12345678
            roles: {
                create: parsedRoles,
            }
        },
    });
}

async function addHotel(name: string, description: string, address: string): Promise<Hotel> {
    return await prisma.hotel.upsert({
        where: { name: name },
        update: {
            description: description,
            address: address,
        },
        create: {
            name: name,
            description: description,
            address: address,
        },
    });
}

async function addFloors(hotel: Hotel, totalFloors: number): Promise<Floor[]> {
    let floorArray: Promise<Floor>[] = [];

    for (let floorNumber = 0; floorNumber < totalFloors; floorNumber++) {
        floorArray.push(prisma.floor.upsert({
            where: {
                hotelId_number: {
                    hotelId: hotel.id,
                    number: floorNumber,
                }
            },
            update: {},
            create: {
                hotelId: hotel.id,
                number: floorNumber,
            },
        }));
    }
    return await Promise.all(floorArray);
}

async function addRoomTypes(hotel: Hotel, name: string, description: string, size: string, price: number, supportedPeople: number): Promise<RoomType> {
    return await prisma.roomType.upsert({
        where: {
            hotelId_name: {
                hotelId: hotel.id,
                name: name,
            },
        },
        update: {
            description: description,
            size: size,
            price: price,
            supportedPeople: supportedPeople,
        },
        create: {
            hotelId: hotel.id,
            name: name,
            description: description,
            size: size,
            price: price,
            supportedPeople: supportedPeople,
        },
    });
}

async function addRooms(hotel: Hotel, floorsInHotel: Floor[], roomTypesInHotel: RoomType[], totalRooms: number): Promise<void> {
    let roomArray: { floorId: number, roomTypeId: number, number: number }[] = [];

    const totalFloors = floorsInHotel.length;
    const totalRoomsPerFloor = Math.round(totalRooms / totalFloors);
    floorsInHotel.forEach((floor) => {
        for (let roomNumber = 1; roomNumber < totalRoomsPerFloor; roomNumber++) {
            const randomRoomType = roomTypesInHotel[Math.floor(Math.random() * roomTypesInHotel.length)]
            roomArray.push({
                floorId: floor.id,
                roomTypeId: randomRoomType.id,
                number: roomNumber,
            });
        }
    })

    await prisma.room.createMany({
        data: roomArray,
        skipDuplicates: true,
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });