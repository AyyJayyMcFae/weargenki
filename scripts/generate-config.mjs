import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outFile = path.join(root, 'genki-config.js');

const keyMap = {
  SUPABASE_URL: 'PUBLIC_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'PUBLIC_SUPABASE_ANON_KEY',
  SQUARE_APP_ID: 'PUBLIC_SQUARE_APP_ID',
  SQUARE_LOCATION_ID: 'PUBLIC_SQUARE_LOCATION_ID'
};

const requiredConfigKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const optionalConfigKeys = ['SQUARE_APP_ID', 'SQUARE_LOCATION_ID'];

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
