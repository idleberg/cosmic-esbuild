const { defineConfig } = require('cosmic-esbuild');

module.exports = defineConfig({
	bundle: true,
	entryPoints: ['app.js'],
	outdir: 'dist',
	sourcemap: 'external',
});
