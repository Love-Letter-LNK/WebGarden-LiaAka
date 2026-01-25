const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // ============ SEED ADMIN USER ============
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@liaazekk.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ZekkLia2024!';

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log(`✓ Admin user already exists: ${adminEmail}`);
    } else {
        const passwordHash = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                role: 'admin'
            }
        });
        console.log(`✓ Created admin user: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log('  ⚠️  Change this password in production!\n');
    }

    // ============ SEED PROFILES ============
    console.log('👤 Seeding profiles...\n');

    const profiles = [
        {
            slug: 'zekk',
            name: 'Zakaria',
            nickname: 'Zekk',
            bio: 'A tech enthusiast who loves creating things for Lia',
            birthDate: '',
            hobbies: 'Coding,Design,Gaming',
            likes: 'Lia,Pizza,Coffee',
            loveLanguage: 'Physical Touch',
            funFacts: JSON.stringify([
                'Pernah bergadang 2 hari buat coding website buat Lia',
                'Suka banget makan Pizza',
                'Kalau tidur suka meluk guling erat-erat (bayangin Lia)'
            ]),
            avatar: '/zekk_pixel.png',
            color: '#3b82f6' // blue
        },
        {
            slug: 'lia',
            name: 'Lia',
            nickname: 'Lia',
            bio: 'A creative soul who fills Zekk\'s life with colors',
            birthDate: '',
            hobbies: 'Reading,Art,Music',
            likes: 'Zekk,Flowers,Tea',
            loveLanguage: 'Words of Affirmation',
            funFacts: JSON.stringify([
                'Suka baca novel romantis',
                'Paling suka warna pink',
                'Kalau malu suka tutup muka pake tangan'
            ]),
            avatar: '/lia_pixel.png',
            color: '#ec4899' // pink
        }
    ];

    for (const profile of profiles) {
        const existing = await prisma.profile.findUnique({ where: { slug: profile.slug } });
        if (!existing) {
            await prisma.profile.create({ data: profile });
            console.log(`  ✓ Created profile: ${profile.nickname}`);
        } else {
            console.log(`  - Profile exists: ${profile.nickname}`);
        }
    }

    // ============ SEED NEWS ============
    console.log('\n📰 Seeding news...\n');

    const newsItems = [
        { title: 'Merry Christmas Together!', date: new Date('2024-12-25'), category: 'celebration', emoji: '🎄' },
        { title: 'Christmas Eve Date', date: new Date('2024-12-24'), category: 'date', emoji: '🌟' },
        { title: 'Website Zekk & Lia Launched!', date: new Date('2024-12-20'), category: 'announcement', emoji: '🚀' },
        { title: 'Anniversary Celebration', date: new Date('2024-12-15'), category: 'celebration', emoji: '💕' },
        { title: 'New Photos Added', date: new Date('2024-12-10'), category: 'update', emoji: '📸' },
    ];

    const newsCount = await prisma.news.count();
    if (newsCount === 0) {
        for (const news of newsItems) {
            await prisma.news.create({ data: news });
            console.log(`  ✓ Created news: ${news.title}`);
        }
    } else {
        console.log(`  - News already seeded (${newsCount} items)`);
    }

    // ============ SEED JOURNEY ============
    console.log('\n🗺️ Seeding journey milestones...\n');

    const journeyItems = [
        { title: 'First Encounter', date: new Date('2023-01-15'), description: 'The day we first met', icon: '👋', sortOrder: 1 },
        { title: 'First Date', date: new Date('2023-02-14'), description: 'Our first date on Valentine\'s Day', icon: '💕', sortOrder: 2 },
        { title: 'Officially Us', date: new Date('2023-03-01'), description: 'We became a couple!', icon: '💑', sortOrder: 3 },
        { title: 'First Anniversary', date: new Date('2024-03-01'), description: 'One year together!', icon: '🎂', sortOrder: 4 },
        { title: 'Digital Garden', date: new Date('2024-12-20'), description: 'Launched our love website', icon: '🌸', sortOrder: 5 },
    ];

    const journeyCount = await prisma.journey.count();
    // Always check for seed items presence
    for (const journey of journeyItems) {
        const existing = await prisma.journey.findFirst({
            where: { title: journey.title }
        });

        if (!existing) {
            await prisma.journey.create({ data: journey });
            console.log(`  ✓ Created journey: ${journey.title}`);
        } else {
            console.log(`  - Journey already exists: ${journey.title}`);
        }
    }

    // ============ MIGRATE OLD MEMORIES ============
    const oldDataPath = path.join(__dirname, '../data/memories.json');

    if (fs.existsSync(oldDataPath)) {
        console.log('\n📦 Migrating old memories.json...\n');

        try {
            const oldData = JSON.parse(fs.readFileSync(oldDataPath, 'utf-8'));

            for (const item of oldData) {
                const existingMemory = await prisma.memory.findFirst({
                    where: { title: { contains: item.caption || `Memory ${item.id}` } }
                });

                if (existingMemory) {
                    console.log(`  - Skipping: "${item.caption}" (already exists)`);
                    continue;
                }

                const title = item.caption || `Memory ${item.id}`;
                const slug = title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    + '-' + Date.now().toString(36);

                await prisma.memory.create({
                    data: {
                        slug,
                        title,
                        date: new Date(),
                        category: 'Random',
                        tags: 'imported,legacy',
                        mood: 'sweet',
                        images: item.image ? {
                            create: [{ url: item.image, alt: title, sortOrder: 0 }]
                        } : undefined
                    }
                });

                console.log(`  ✓ Migrated: "${title}"`);
            }
        } catch (error) {
            console.error('  ✗ Migration error:', error.message);
        }
    }

    // ============ SEED SAMPLE CONTACT MESSAGES ============
    console.log('\n💌 Seeding sample contact messages...\n');

    const contactCount = await prisma.contactMessage.count();
    if (contactCount === 0) {
        const messages = [
            { recipient: 'zekk', message: 'Hey, great website!', senderName: 'Visitor' },
            { recipient: 'lia', message: 'You two are so cute together!', senderName: 'Fan' },
        ];
        for (const msg of messages) {
            await prisma.contactMessage.create({ data: msg });
            console.log(`  ✓ Created message to ${msg.recipient}`);
        }
    } else {
        console.log(`  - Messages already seeded (${contactCount} items)`);
    }

    console.log('\n🎉 Seed complete!\n');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
