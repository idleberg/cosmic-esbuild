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
			'package.json',
			'.esbuildrc',
			'.esbuildrc.json',
			'.esbuildrc.jsonc',
			'.esbuildrc.yaml',
			'.esbuildrc.yml',
			'.esbuildrc.toml',
			'.esbuildrc.cson',
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
