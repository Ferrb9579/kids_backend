// seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Define User Roles
    const userRoles = [
        {
            name: 'Admin',
            bitmask: 63, // 1 + 2 + 4 + 8 + 16 + 32
        },
        {
            name: 'Manager',
            bitmask: 23, // 1 + 2 + 4 + 16
        },
        {
            name: 'User',
            bitmask: 13, // 1 + 4 + 8
        },
    ];

    // Define Event Roles
    const eventRoles = [
        {
            name: 'Event Manager',
            bitmask: 31, // 1 + 2 + 4 + 8 + 16
        },
        {
            name: 'Event Coordinator',
            bitmask: 15, // 1 + 2 + 4 + 8
        },
        {
            name: 'Event Viewer',
            bitmask: 9,  // 1 + 8
        },
    ];

    // Create User Roles
    for (const role of userRoles) {
        await prisma.userRole.upsert({
            where: { name: role.name },
            update: {},
            create: {
                name: role.name,
                bitmask: role.bitmask,
            },
        });
    }

    // Create Event Roles
    for (const role of eventRoles) {
        await prisma.eventRole.upsert({
            where: { name: role.name },
            update: {},
            create: {
                name: role.name,
                bitmask: role.bitmask,
            },
        });
    }

    console.log('Seeded roles successfully.');

    // ----- ADDITION: Create Boss User -----
    // Define Boss User Details
    const bossUserEmail = 'boss@karunya.edu';
    const bossUserKid = 'bosskid'; // Ensure this is unique
    const bossUsername = 'Boss User';
    const bossUserRole = 'boss'; // Optional: Define if you have a separate role type

    // Create or Update Boss User
    const bossUser = await prisma.user.upsert({
        where: { kmail: bossUserEmail },
        update: {},
        create: {
            kid: bossUserKid,
            username: bossUsername,
            kmail: bossUserEmail,
            role: bossUserRole, // Optional: Adjust based on your application logic
        },
    });

    console.log('Boss user created or already exists.');

    // ----- ADDITION: Assign All User Roles to Boss User -----
    // Fetch All User Roles
    const allUserRoles = await prisma.userRole.findMany();

    // Assign Each Role to Boss User
    for (const role of allUserRoles) {
        await prisma.userRoleAssignment.upsert({
            where: {
                userId_roleId: {
                    userId: bossUser.id,
                    roleId: role.id,
                },
            },
            update: {},
            create: {
                userId: bossUser.id,
                roleId: role.id,
            },
        });
    }

    console.log('All user roles assigned to Boss user successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
