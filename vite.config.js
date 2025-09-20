import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/hasana.js',
                'resources/js/admin.js',
                'resources/images/hasana/logo.svg',
                'resources/images/hasana/logo-g.svg',
            ],
            refresh: true,
        }),
    ],
});


