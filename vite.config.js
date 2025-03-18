import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		react(),
		visualizer({
			open: true,
		}),
	],
	server: {
		port: 3000,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false
			}
		}
	},
	base: '/personal-portfolio/'
});