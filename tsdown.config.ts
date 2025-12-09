import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		clean: isProduction,
		dts: isProduction,
		entry: {
			cli: 'src/index.node.ts',
			config: 'src/config.ts',
		},
		external: [
			// ensure we always read the current version from the manifests
			'../deno.json',
			'../package.json',
		],
		format: ['esm', 'cjs'],
		minify: isProduction,
		outDir: 'lib',
		target: 'node18',
	};
});
