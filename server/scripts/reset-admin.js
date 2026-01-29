require('dotenv').config({ path: '../.env' }); // Adjust path to find .env in server root
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 STARTING ADMIN ACCOUNT RESET');
    console.log('--------------------------------');

    // 1. Define Credentials
    const email = 'admin@aka-lia.love';
    console.log(`📧 Target Email:   ${email}`);

    // 2. Hash Password
    // Using a known simple string 'ZekkLia2024!'
    const passwordRaw = 'ZekkLia2024!';
    console.log(`🔑 Target Password: ${passwordRaw}`);
    const passwordHash = await bcrypt.hash(passwordRaw, 12);

    // 3. Upsert User (Create if not exists, Update if exists)
    const user = await prisma.user.upsert({
        where: { email: email },
        update: {
            passwordHash: passwordHash,
            role: 'admin' // Ensure role is admin
        },
        create: {
            email: email,
            passwordHash: passwordHash,
            role: 'admin'
        }
    });

    console.log('--------------------------------');
    console.log('✅ SUCCESS: Admin user updated/created.');
    console.log('--------------------------------');
    console.log('👉 Try logging in now at: https://aka-lia.love/__admin');
}

main()
    .catch((e) => {
        console.error('❌ ERROR:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
