import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		clean: isProduction,
		dts: isProduction,
		entry: {
			cli: 'src/index.ts',
			config: 'src/config.ts',
		},
		format: ['esm', 'cjs'],
		minify: isProduction,
		outDir: 'lib',
		target: 'node18',
	};
});
