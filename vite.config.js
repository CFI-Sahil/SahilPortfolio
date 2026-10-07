import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'generate-200-html',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const fallbackPath = path.join(distDir, '200.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
        }
      },
    },
  ],
  server: {
    watch: {
      ignored: ['**/*.mp4', '**/*.crdownload', '**/*.tmp', '**/Refrences/**', '**/dist/**', '**/.git/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-animation': ['gsap', 'framer-motion', 'lenis'],
          'vendor-icons': ['react-icons', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
