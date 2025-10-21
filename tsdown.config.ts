import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		target: 'node18',
		clean: isProduction,
		dts: isProduction,
		entry: {
			bin: 'src/index.ts',
			config: 'src/config.ts',
		},
		format: ['esm', 'cjs'],
		minify: isProduction,
		outDir: 'lib',
	};
});
