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
		open: true
	},
	base: '/personal-portfolio/'
});