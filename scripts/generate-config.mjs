import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outFile = path.join(root, 'genki-config.js');
const robotsFile = path.join(root, 'robots.txt');
const sitemapFile = path.join(root, 'sitemap.xml');
const manifestFile = path.join(root, 'site.webmanifest');

const keyMap = {
  SUPABASE_URL: 'PUBLIC_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'PUBLIC_SUPABASE_ANON_KEY',
  SITE_URL: 'PUBLIC_SITE_URL',
  SQUARE_APP_ID: 'PUBLIC_SQUARE_APP_ID',
  SQUARE_LOCATION_ID: 'PUBLIC_SQUARE_LOCATION_ID',
  SHIPPING_RATE: 'PUBLIC_SHIPPING_RATE'
};

const requiredConfigKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const optionalConfigKeys = ['SITE_URL', 'SQUARE_APP_ID', 'SQUARE_LOCATION_ID', 'SHIPPING_RATE'];

const readVar = (name) => (process.env[name] || '').trim();
const config = {};

for (const key of requiredConfigKeys) {
  const envName = keyMap[key];
  const value = readVar(envName);
  if (!value) {
    console.warn(`[generate-config] Missing required env var: ${envName}`);
  }
  config[key] = value || `REPLACE_WITH_${key}`;
}

for (const key of optionalConfigKeys) {
  const envName = keyMap[key];
  const value = readVar(envName);
  config[key] = value || `REPLACE_WITH_${key}`;
}

const fileBody = `// Auto-generated at build time. Do not commit.\nwindow.__GENKI_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync(outFile, fileBody, 'utf8');
console.log(`[generate-config] Wrote ${outFile}`);

const normalizeSiteUrl = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed.startsWith('REPLACE_WITH_')) return 'https://weargenki.vercel.app';
  try {
    const url = new URL(trimmed);
    return url.origin;
  } catch {
    console.warn(`[generate-config] Invalid PUBLIC_SITE_URL "${trimmed}", falling back to https://weargenki.vercel.app`);
    return 'https://weargenki.vercel.app';
  }
};

const siteUrl = normalizeSiteUrl(config.SITE_URL);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
const manifest = {
  name: 'GENKI',
  short_name: 'GENKI',
  description: 'Independent streetwear with limited-run drops, everyday essentials, and bold looks built for real life.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0d0d0d',
  theme_color: '#0d0d0d',
  icons: [
    {
      src: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1772417097/Kanji_Boxed_z35cw0.png',
      sizes: '512x512',
      type: 'image/png'
    },
    {
      src: 'https://res.cloudinary.com/dzhvdoifb/image/upload/v1767129720/blueGlitch_sddxpb.png?v=2',
      sizes: '192x192',
      type: 'image/png'
    }
  ]
};

fs.writeFileSync(robotsFile, robots, 'utf8');
console.log(`[generate-config] Wrote ${robotsFile}`);

fs.writeFileSync(sitemapFile, sitemap, 'utf8');
console.log(`[generate-config] Wrote ${sitemapFile}`);

fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`[generate-config] Wrote ${manifestFile}`);
