import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('cosmiconfig', () => ({
	cosmiconfig: vi.fn(() => ({
		search: vi.fn(),
		load: vi.fn(),
	})),
	defaultLoaders: {},
}));

const mockTsLoader = vi.fn();
vi.mock('cosmiconfig-typescript-loader', () => ({
	TypeScriptLoader: vi.fn(() => mockTsLoader),
}));

vi.mock('./loaders.ts', () => ({
	csonLoader: vi.fn(),
	json5Loader: vi.fn(),
	jsoncLoader: vi.fn(),
	tomlLoader: vi.fn(),
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
			'.esbuildrc.json5',
			'.esbuildrc.jsonc',
			'.esbuildrc.yaml',
			'.esbuildrc.yml',
			'.esbuildrc.toml',
			'.esbuildrc.js',
			'.esbuildrc.ts',
			'.esbuildrc.cjs',
			'.esbuildrc.mjs',
			'.esbuildrc.cts',
			'.esbuildrc.mts',
			'.esbuildrc.cson',

			// .config folder
			'.config/esbuildrc',
			'.config/esbuildrc.json',
			'.config/esbuildrc.json5',
			'.config/esbuildrc.jsonc',
			'.config/esbuildrc.yaml',
			'.config/esbuildrc.yml',
			'.config/esbuildrc.toml',
			'.config/esbuildrc.js',
			'.config/esbuildrc.ts',
			'.config/esbuildrc.cjs',
			'.config/esbuildrc.mjs',
			'.config/esbuildrc.cts',
			'.config/esbuildrc.mts',
			'.config/esbuildrc.cson',

			// config files
			'esbuild.config.json',
			'esbuild.config.json5',
			'esbuild.config.jsonc',
			'esbuild.config.yaml',
			'esbuild.config.yml',
			'esbuild.config.toml',
			'esbuild.config.js',
			'esbuild.config.ts',
			'esbuild.config.cjs',
			'esbuild.config.mjs',
			'esbuild.config.cts',
			'esbuild.config.mts',
			'esbuild.config.cson',
		]);
	});

	it('configures cosmiconfig with correct loaders', async () => {
		const { cosmiconfig } = await import('cosmiconfig');
		const { csonLoader, json5Loader, jsoncLoader, tomlLoader } = await import('./loaders.ts');
		await import('./cosmiconfig.ts');

		const callArgs = vi.mocked(cosmiconfig).mock.calls[0]?.[1];

		expect(callArgs?.loaders).toEqual({
			'.cson': csonLoader,
			'.json': jsoncLoader,
			'.json5': json5Loader,
			'.jsonc': jsoncLoader,
			'.ts': mockTsLoader,
			'.cts': mockTsLoader,
			'.mts': mockTsLoader,
			'.toml': tomlLoader,
		});
	});
});
