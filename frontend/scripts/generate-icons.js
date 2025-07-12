const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configurações dos ícones
const iconSizes = [192, 512]; // Tamanhos necessários para o PWA
const outputDir = path.join(__dirname, '../public/assets/icons');

// Cria o diretório de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Cores do tema
const colors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  text: '#2C3E50'
};

// Função para criar um ícone
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fundo
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, size, size);
  
  // Gradiente de fundo
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);
  
  // Forma central
  const center = size / 2;
  const radius = size * 0.4;
  
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Símbolo (um prato de restaurante estilizado)
  ctx.fillStyle = colors.background;
  const plateSize = size * 0.3;
  const plateY = center - plateSize / 3;
  
  // Prato
  ctx.beginPath();
  ctx.ellipse(center, plateY, plateSize * 0.8, plateSize * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Talheres
  ctx.fillStyle = colors.primary;
  const utensilSize = size * 0.15;
  
  // Garfo
  ctx.fillRect(
    center - plateSize * 0.7,
    plateY - utensilSize,
    utensilSize * 0.4,
    utensilSize * 3
  );
  
  // Faca
  ctx.fillRect(
    center + plateSize * 0.3,
    plateY - utensilSize,
    utensilSize * 0.4,
    utensilSize * 3
  );
  
  // Texto (apenas para ícones maiores)
  if (size >= 192) {
    ctx.fillStyle = colors.text;
    ctx.font = `bold ${size * 0.12}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('RP', center, center + size * 0.3);
  }
  
  return canvas;
}

// Gera os ícones
iconSizes.forEach(size => {
  const icon = createIcon(size);
  const buffer = icon.toBuffer('image/png');
  const filename = `pwa-${size}x${size}.png`;
  const outputPath = path.join(outputDir, filename);
  
  fs.writeFileSync(outputPath, buffer);
  console.log(`Ícone gerado: ${outputPath}`);
});

// Gera o favicon (32x32)
const faviconSize = 32;
const favicon = createIcon(faviconSize);
const faviconBuffer = favicon.toBuffer('image/png');
fs.writeFileSync(path.join(outputDir, 'favicon.ico'), faviconBuffer);
console.log('Favicon gerado');

// Copia o arquivo manifest.json
const manifest = {
  "name": "RestaurantPro",
  "short_name": "RestaurantPro",
  "description": "Solução completa para gestão de restaurantes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FF6B6B",
  "icons": [
    {
      "src": "/assets/icons/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/assets/icons/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
};

fs.writeFileSync(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('Arquivo manifest.json gerado');
