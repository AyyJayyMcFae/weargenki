import fs from 'fs';

// read the index.html and extract the PRODUCTS array definition
// assumes script is run from repo root
const html = fs.readFileSync('index.html', 'utf-8');

const marker = 'const PRODUCTS = [';
const startIdx = html.indexOf(marker);
if (startIdx === -1) {
  console.error('PRODUCTS marker not found');
  process.exit(1);
}

// find matching closing bracket by tracking depth
let depth = 0;
let endIdx = -1;
for (let i = startIdx + marker.length - 1; i < html.length; i++) {
  const ch = html[i];
  if (ch === '[') depth++;
  else if (ch === ']') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
  }
}
if (endIdx === -1) {
  console.error('Could not find end of PRODUCTS array');
  process.exit(1);
}

const arrText = html.slice(startIdx + marker.length - 1, endIdx + 1);

// parse the products array text into actual JS
let PRODUCTS;
try {
  PRODUCTS = eval(arrText);
} catch (e) {
  console.error('Failed to eval PRODUCTS array:', e);
  process.exit(1);
}

// flatten products for CSV
function flatten(p) {
  const sizes = Array.isArray(p.sizes) ? p.sizes.join(';') : '';
  const colors = Array.isArray(p.colors)
    ? p.colors.map(c => c.name || '').join(';')
    : '';
  let skullOptions = '';
  if (p.skullOptions) {
    skullOptions = p.skullOptions
      .map(o => {
        const hoodies = (o.hoodies || []).map(h => h.name).join(',');
        return `${o.name}:${hoodies}`;
      })
      .join('|');
  }

  return {
    id: p.id || '',
    title: p.title || '',
    price: p.price || '',
    badge: p.badge || '',
    categories: p.categories || '',
    keywords: p.keywords || '',
    sizes,
    colors,
    primaryOptionLabel: p.primaryOptionLabel || '',
    secondaryOptionLabel: p.secondaryOptionLabel || '',
    skullOptions,
    image: Array.isArray(p.images) && p.images.length ? p.images[0] : '',
    details: Array.isArray(p.details) ? p.details.join(' | ') : ''
  };
}

const rows = PRODUCTS.map(flatten);
if (rows.length === 0) {
  console.error('No products found');
  process.exit(1);
}

const header = Object.keys(rows[0]).join(',');
const lines = rows.map(r =>
  Object.values(r)
    .map(v => `"${String(v).replace(/"/g, '""')}"`)
    .join(',')
);
const csv = header + '\n' + lines.join('\n');
fs.writeFileSync('products-full.csv', csv, 'utf-8');
console.log('Written products-full.csv with', rows.length, 'rows');
