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
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false
			}
		}
	},
	base: '/',
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		rollupOptions: {
			output: {
				manualChunks: undefined
			}
		}
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
});