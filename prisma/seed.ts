import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    let roles = [];
    roles[] = await prisma.role.upsert({
        where: { name: '' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test mand!',
            password: '$2b$10$pr4MQNbFNnOmlKepGkLL.e2SlmCWTrb5XDsCUPAXzcl5BhPlYkfhC',
        },
    });

    const testUser = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            email: 'test@test.com',
            name: 'Test mand!',
            password: '$2b$10$pr4MQNbFNnOmlKepGkLL.e2SlmCWTrb5XDsCUPAXzcl5BhPlYkfhC',
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
