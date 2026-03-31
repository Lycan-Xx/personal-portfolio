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
		port: 5173,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				secure: false,
			},
			'/api/github': {
				target: 'https://api.github.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/github/, ''),
			},
		},
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
});