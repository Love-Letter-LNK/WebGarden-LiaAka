
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma Connection...');
    try {
        await prisma.$connect();
        console.log('Successfully connected to database.');
        const count = await prisma.user.count();
        console.log(`Found ${count} users.`);
    } catch (e) {
        console.error('Prisma connection error:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
