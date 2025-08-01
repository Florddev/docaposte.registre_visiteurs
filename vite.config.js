import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        host: '0.0.0.0',
        port: 5173,
        cors: {
            origin: [
                'http://localhost:2402',
                'http://localhost:8000',
                'http://127.0.0.1:2402',
                'http://127.0.0.1:8000'
            ],
            credentials: true,
        },
        strictPort: true,
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
});
