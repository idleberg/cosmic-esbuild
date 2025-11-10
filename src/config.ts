import type { BuildOptions } from 'esbuild';

export type { BuildOptions };

/**
 * Defines the configuration for esbuild.
 */
export function defineConfig(config: BuildOptions): BuildOptions {
	return config;
}
