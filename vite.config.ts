
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'react-hook-form@7.55.0': 'react-hook-form',
        'figma:asset/ad3fda8282e7e85c71a9be5e2a628c9297c983e7.png': path.resolve(__dirname, './src/assets/ad3fda8282e7e85c71a9be5e2a628c9297c983e7.png'),
        'figma:asset/5fc1c91d532ed8327a51913627755ef8443b2b88.png': path.resolve(__dirname, './src/assets/5fc1c91d532ed8327a51913627755ef8443b2b88.png'),
        'figma:asset/5f763c5748e26a81956b18095483cfe574f86a78.png': path.resolve(__dirname, './src/assets/5f763c5748e26a81956b18095483cfe574f86a78.png'),
        'figma:asset/37523d906f50997b8bae4315c9f85ec1060d318a.png': path.resolve(__dirname, './src/assets/37523d906f50997b8bae4315c9f85ec1060d318a.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });