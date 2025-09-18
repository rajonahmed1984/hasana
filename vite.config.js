import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/hasana.js',
                'resources/frontend/assets/img/logo.svg',
                'resources/frontend/assets/img/logo-g.svg',
            ],
            refresh: true,
        }),
    ],
});

