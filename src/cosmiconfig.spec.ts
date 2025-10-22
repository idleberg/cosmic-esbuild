import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('cosmiconfig', () => ({
	cosmiconfig: vi.fn(() => ({
		search: vi.fn(),
		load: vi.fn(),
	})),
}));

describe('explorer', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('configures cosmiconfig with correct search places', async () => {
		const { cosmiconfig } = await import('cosmiconfig');
		await import('./cosmiconfig.ts');

		expect(cosmiconfig).toHaveBeenCalledOnce();
		expect(cosmiconfig).toHaveBeenCalledWith('esbuild', expect.any(Object));

		const callArgs = vi.mocked(cosmiconfig).mock.calls[0]?.[1];

		expect(callArgs?.searchPlaces).toEqual([
			// manifest
			'package.json',

			// runcom files
			'.esbuildrc',
			'.esbuildrc.json',
			'.esbuildrc.jsonc',
			'.esbuildrc.yaml',
			'.esbuildrc.yml',
			'.esbuildrc.toml',
			'.esbuildrc.js',
			'.esbuildrc.ts',
			'.esbuildrc.cjs',
			'.esbuildrc.mjs',
			'.esbuildrc.cson',

			// .config folder
			'.config/esbuildrc',
			'.config/esbuildrc.json',
			'.config/esbuildrc.jsonc',
			'.config/esbuildrc.yaml',
			'.config/esbuildrc.yml',
			'.config/esbuildrc.toml',
			'.config/esbuildrc.js',
			'.config/esbuildrc.ts',
			'.config/esbuildrc.cjs',
			'.config/esbuildrc.mjs',
			'.config/esbuildrc.cson',

			// config files
			'esbuild.config.json',
			'esbuild.config.jsonc',
			'esbuild.config.yaml',
			'esbuild.config.yml',
			'esbuild.config.toml',
			'esbuild.config.js',
			'esbuild.config.ts',
			'esbuild.config.cjs',
			'esbuild.config.mjs',
			'esbuild.config.cson',
		]);
	});
});
