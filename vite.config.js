import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app/main.jsx',
                'resources/js/admin/main.jsx',
                'resources/js/hasana.js',
                'resources/js/admin.js',
                'resources/js/admin/app.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
});
