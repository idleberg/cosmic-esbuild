import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	const sharedConfig = {
		clean: isProduction,
		dts: isProduction,
		format: ['esm', 'cjs'],
		minify: isProduction,
		platform: 'node',
		target: 'node18',
	};

	return [
		{
			...sharedConfig,
			entry: 'src/index.ts',
			outDir: 'bin',
		},
		{
			...sharedConfig,
			entry: 'src/config.ts',
			outDir: 'lib',
		},
	];
});
