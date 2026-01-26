const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking database users...');

    // Check connection
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);

        if (users.length === 0) {
            console.log('❌ No users found! Database is empty.');
            console.log('Did you run "npm run db:seed"?');
        } else {
            users.forEach(u => {
                console.log(`\n👤 User: ${u.email}`);
                console.log(`   ID: ${u.id}`);
                console.log(`   Role: ${u.role}`);
                console.log(`   Password Hash (first 10 chars): ${u.passwordHash.substring(0, 10)}...`);
            });
            console.log('\n✅ Admin user exists. Please verified the email matches exactly what you type.');
        }
    } catch (e) {
        console.error('❌ Error connecting to database:', e.message);
        console.error('Check your DATABASE_URL in .env');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
