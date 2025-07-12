import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import pwaConfig from './vite.config.pwa';

interface AssetInfo {
  name: string | undefined;
}

// Configuração base do Vite
const baseConfig: UserConfig = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  // Configuração de build comum
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo: AssetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const name = assetInfo.name;
          
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Em desenvolvimento, usa apenas a configuração base
  if (command === 'serve') {
    return baseConfig;
  }
  
  // Em produção, mescla com a configuração PWA
  return mergeConfig(baseConfig, pwaConfig);
});
