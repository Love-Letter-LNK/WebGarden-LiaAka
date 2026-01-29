require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🐞 STARTING LOGIN DEBUGGER');
    console.log('--------------------------------');

    // 1. List ALL Users to see what's actually in the DB
    const allUsers = await prisma.user.findMany();
    console.log(`📊 Total Users found: ${allUsers.length}`);
    allUsers.forEach(u => {
        console.log(`   - ID: ${u.id} | Email: "${u.email}" | Role: ${u.role}`);
    });

    console.log('--------------------------------');

    // 2. Test Admin Login specifically
    const targetEmail = 'admin@aka-lia.love';
    const targetPass = 'ZekkLia2024!'; // Force test this password

    console.log(`Testing Login for: [${targetEmail}] with pass [${targetPass}]`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail }
    });

    if (!user) {
        console.error('❌ ERROR: User NOT found in database!');
    } else {
        console.log('✅ User found in DB.');
        const match = await bcrypt.compare(targetPass, user.passwordHash);
        if (match) {
            console.log('✅ PASSWORD MATCHES! (Bcrypt verify success)');
        } else {
            console.error('❌ PASSWORD DOES NOT MATCH! (Bcrypt verify failed)');
            console.log('   Hash in DB:', user.passwordHash.substring(0, 20) + '...');
        }
    }
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
