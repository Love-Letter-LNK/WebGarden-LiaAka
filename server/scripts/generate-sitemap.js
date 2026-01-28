/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml from database content
 * 
 * Usage: node server/scripts/generate-sitemap.js
 * Run this via cron or PM2 every 24 hours
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SITE_URL = process.env.SITE_URL || 'https://liaazekk.com';
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'client', 'public', 'sitemap.xml');

// Static pages with their priorities
const STATIC_PAGES = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/memories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/news', changefreq: 'weekly', priority: '0.8' },
    { loc: '/profile', changefreq: 'monthly', priority: '0.7' },
    { loc: '/qna', changefreq: 'weekly', priority: '0.7' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
    { loc: '/playlist', changefreq: 'monthly', priority: '0.6' },
    { loc: '/calculator', changefreq: 'monthly', priority: '0.5' },
    { loc: '/travel', changefreq: 'weekly', priority: '0.7' },
    { loc: '/letters', changefreq: 'monthly', priority: '0.6' },
    { loc: '/guide', changefreq: 'monthly', priority: '0.5' },
    // Categories
    { loc: '/category/first-date', changefreq: 'monthly', priority: '0.6' },
    { loc: '/category/anniversary', changefreq: 'monthly', priority: '0.6' },
    { loc: '/category/travel', changefreq: 'monthly', priority: '0.6' },
    { loc: '/category/random', changefreq: 'monthly', priority: '0.6' },
];

async function generateSitemap() {
    console.log('🗺️  Generating dynamic sitemap...');

    try {
        // Fetch dynamic content from database
        const [memories, news] = await Promise.all([
            prisma.memory.findMany({ select: { slug: true, updatedAt: true } }),
            prisma.news.findMany({ where: { published: true }, select: { id: true, updatedAt: true } }),
        ]);

        console.log(`   Found ${memories.length} memories, ${news.length} news articles`);

        // Build XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        for (const page of STATIC_PAGES) {
            xml += '  <url>\n';
            xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        }

        // Add dynamic memory pages
        for (const memory of memories) {
            xml += '  <url>\n';
            xml += `    <loc>${SITE_URL}/memories/${memory.slug}</loc>\n`;
            xml += `    <lastmod>${memory.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        }

        // Add dynamic news pages (if you have individual news pages)
        for (const item of news) {
            xml += '  <url>\n';
            xml += `    <loc>${SITE_URL}/news/${item.id}</loc>\n`;
            xml += `    <lastmod>${item.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.6</priority>\n';
            xml += '  </url>\n';
        }

        xml += '</urlset>\n';

        // Write to file
        fs.writeFileSync(OUTPUT_PATH, xml, 'utf-8');
        console.log(`✅ Sitemap generated successfully: ${OUTPUT_PATH}`);
        console.log(`   Total URLs: ${STATIC_PAGES.length + memories.length + news.length}`);

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

generateSitemap();
