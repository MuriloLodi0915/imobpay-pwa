const fs = require('fs');
const path = require('path');

// Criar diretório scripts se não existir
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// Criar diretório public se não existir
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Criar ícones SVG básicos para PWA
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

// SVG base para o ícone
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#3b82f6"/>
  <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.6}" height="${size * 0.6}" rx="${size * 0.1}" fill="white"/>
  <path d="M${size * 0.35} ${size * 0.35} L${size * 0.65} ${size * 0.35} L${size * 0.65} ${size * 0.65} L${size * 0.35} ${size * 0.65} Z" fill="#3b82f6"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.08}" fill="white"/>
</svg>
`;

// Criar favicon.ico (simulado como SVG)
const faviconSVG = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#3b82f6"/>
  <rect x="6" y="6" width="20" height="20" rx="3" fill="white"/>
  <path d="M11 11 L21 11 L21 21 L11 21 Z" fill="#3b82f6"/>
  <circle cx="16" cy="16" r="2.5" fill="white"/>
</svg>
`;

// Criar safari-pinned-tab.svg
const safariPinnedTabSVG = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 2 L14 2 L14 14 L2 14 Z" fill="#3b82f6"/>
  <path d="M3 3 L13 3 L13 13 L3 13 Z" fill="white"/>
  <path d="M4 4 L12 4 L12 12 L4 12 Z" fill="#3b82f6"/>
  <circle cx="8" cy="8" r="1.5" fill="white"/>
</svg>
`;

console.log('Gerando ícones PWA...');

// Criar favicon.ico
fs.writeFileSync('public/favicon.ico', faviconSVG);
console.log('✓ favicon.ico criado');

// Criar safari-pinned-tab.svg
fs.writeFileSync('public/safari-pinned-tab.svg', safariPinnedTabSVG);
console.log('✓ safari-pinned-tab.svg criado');

// Criar ícones PNG (simulados como SVG por enquanto)
iconSizes.forEach(({ size, name }) => {
  const svg = createIconSVG(size);
  fs.writeFileSync(`public/${name}`, svg);
  console.log(`✓ ${name} criado`);
});

console.log('\nTodos os ícones PWA foram gerados!');
console.log('\nNota: Os arquivos foram criados como SVG. Para produção, você deve:');
console.log('1. Converter os SVGs para PNG usando ferramentas como Inkscape, GIMP ou online converters');
console.log('2. Otimizar os ícones para web');
console.log('3. Considerar usar ferramentas como pwa-asset-generator para gerar ícones automaticamente'); 