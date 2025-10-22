import { defineConfig } from 'cosmic-esbuild';

export default defineConfig({
	bundle: true,
	entryPoints: ['app.js'],
	outdir: 'dist',
	sourcemap: 'external',
});
