import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Local development config without base path
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/shared/*': path.resolve(__dirname, './src/shared/*'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/components': path.resolve(__dirname, './src/shared/ui'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/lib/*': path.resolve(__dirname, './src/lib/*'),
    },
  },
})

