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
                'resources/js/admin/app.js'  // ← ADD THIS
            ],
            refresh: true,
        }),
    ],
});
