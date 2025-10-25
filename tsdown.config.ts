import { defineConfig, type UserConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	const sharedConfig = {
		dts: isProduction,
		minify: isProduction,
		target: 'node18',
	} satisfies UserConfig;

	return [
		{
			...sharedConfig,
			entry: 'src/index.ts',
			format: 'esm',
			outDir: 'bin',
		},
		{
			...sharedConfig,
			entry: 'src/config.ts',
			format: ['esm', 'cjs'],
			outDir: 'lib',
		},
	];
});
