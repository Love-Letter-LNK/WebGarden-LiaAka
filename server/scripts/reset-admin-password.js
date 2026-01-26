require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@liaazekk.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'ZekkLia2024!';

    console.log(`🔐 Resetting password for: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ User not found!');
        return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { email },
        data: { passwordHash }
    });

    console.log('\n✅ Password updated successfully!');
    console.log('You should now be able to login.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
