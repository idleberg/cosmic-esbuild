import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	const sharedConfig = {
		target: 'node18',
		clean: isProduction,
		dts: isProduction,
		format: ['esm', 'cjs'],
		minify: isProduction,
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
