import { Floor, Hotel, Permission, PrismaClient, Role, RoomType, User } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    /**
     * Define array variables
     */
    let permissions: Permission[] = [];
    let users: User[] = [];
    let roles: Role[] = [];
    let hotels: Hotel[] = [];
    let floors: Floor[] = [];
    let roomTypes: RoomType[] = [];

    /**
     * Permission upserts
     */
    const hotelCreatePermission = await addPermission('Hotel Create')
    const hotelUpdatePermission = await addPermission('Hotel Update');
    const hotelDeletePermission = await addPermission('Hotel Delete');
    const floorBrowsePermission = await addPermission('Floor Browse');
    const floorShowPermission = await addPermission('Floor Show');
    const floorCreatePermission = await addPermission('Floor Create');
    const floorUpdatePermission = await addPermission('Floor Update');
    const floorDeletePermission = await addPermission('Floor Delete');
    const roomTypeCreatePermission = await addPermission('Room Type Create');
    const roomTypeUpdatePermission = await addPermission('Room Type Update');
    const roomTypeDeletePermission = await addPermission('Room Type Delete');
    const swaggerPermission = await addPermission('Swagger');
    permissions.push(
        hotelCreatePermission,
        hotelUpdatePermission,
        hotelDeletePermission,
        floorBrowsePermission,
        floorShowPermission,
        floorCreatePermission,
        floorUpdatePermission,
        floorDeletePermission,
        roomTypeCreatePermission,
        roomTypeUpdatePermission,
        roomTypeDeletePermission,
        swaggerPermission,
    );

    /**
     * Roles upserts
     */
    const receptionistRole = await addRole('Receptionist', [floorBrowsePermission, floorShowPermission]);
    const supporterRole = await addRole('Supporter', [floorBrowsePermission, floorShowPermission]);
    const branchManagerRole = await addRole('Branch Manager', [hotelUpdatePermission, floorBrowsePermission, floorShowPermission, floorUpdatePermission, roomTypeUpdatePermission]);
    const seniorManagerRole = await addRole('Senior Manager', [hotelCreatePermission, hotelUpdatePermission, floorBrowsePermission, floorShowPermission, floorCreatePermission, floorUpdatePermission, floorDeletePermission, roomTypeCreatePermission, roomTypeUpdatePermission, roomTypeDeletePermission]);
    const administatorRole = await addRole('Administator', [hotelCreatePermission, hotelUpdatePermission, hotelDeletePermission, floorBrowsePermission, floorShowPermission, floorCreatePermission, floorUpdatePermission, floorDeletePermission, roomTypeCreatePermission, roomTypeUpdatePermission, roomTypeDeletePermission]);
    const developerAdministatorRole = await addRole('Developer Administator', permissions);
    roles.push(
        receptionistRole,
        supporterRole,
        branchManagerRole,
        seniorManagerRole,
        administatorRole,
        developerAdministatorRole,
    );

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
    users.push(
        normalUser,
        receptionistUser,
        supporterUser,
        branchManagerUser,
        seniorManagerUser,
        administatorUser,
        developerAdministatorUser,
    );

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
    hotels.push(
        copenhagenHotel,
        odenseHotel,
        aarhusHotel,
    );
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
    return await prisma.role.upsert({
        where: { name: name },
        update: {},
        create: {
            name: name,
        },
    });
}

async function addUser(name: string, email: string, roles: Role[]): Promise<User> {
    return await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
            email: email,
            name: name,
            password: '$2b$10$4cYGVnrLrgbuU5gIiCHE1OhBcwDJATdzBfe9yj5rIFXrH52J8.m9C', // 12345678
        },
    });
}

async function addHotel(name: string, description: string, address: string): Promise<Hotel> {
    return await prisma.hotel.upsert({
        where: { name: name },
        update: {},
        create: {
            name: name,
            description: description,
            address: address,
        },
    });
}

async function addFloors(hotel: Hotel, amount: Number): Promise<Floor[]> {
    // for loop amount
    // create floors in hotel
    // add to array
    // return floors

    return [];
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