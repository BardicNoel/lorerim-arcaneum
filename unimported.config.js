export default {
  // Files to analyze
  entries: ['./src/**/*.{ts,tsx,js,jsx}', './index.html'],

  // Files to ignore
  ignoreUnimported: [
    './src/**/*.test.{ts,tsx,js,jsx}',
    './src/**/*.spec.{ts,tsx,js,jsx}',
    './src/**/__tests__/**',
    './src/**/__mocks__/**',
    './src/vite-env.d.ts',
    './src/main.tsx',
  ],

  // Dependencies to ignore
  ignoreUnresolved: [
    'react',
    'react-dom',
    'react-router-dom',
    '@radix-ui/react-*',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'zustand',
    'zod',
    'fuse.js',
    'react-markdown',
    'react-d3-tree',
    'reactflow',
    'embla-carousel-react',
    'react-resizable-panels',
    'vaul',
  ],

  // TypeScript configuration
  typescript: {
    enabled: true,
  },
}
