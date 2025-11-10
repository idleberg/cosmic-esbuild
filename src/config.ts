import type { BuildOptions } from 'esbuild';

export type { BuildOptions };

export function defineConfig(config: BuildOptions): BuildOptions {
	return config;
}
