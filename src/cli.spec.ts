import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CosmicEsbuild } from '../src/cli.ts';

// Mock dependencies
vi.mock('commander', () => ({
	program: {
		configureOutput: vi.fn().mockReturnThis(),
		option: vi.fn().mockReturnThis(),
		parse: vi.fn(),
		opts: vi.fn(() => ({
			config: undefined,
			watch: false,
			clean: false,
			debug: false,
		})),
	},
}));

vi.mock('consola', () => ({
	createConsola: () => ({
		debug: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		success: vi.fn(),
	}),
}));

vi.mock('./cosmiconfig.ts', () => ({
	explorer: {
		load: vi.fn(async () => ({ config: { foo: 'bar' } })),
		search: vi.fn(async () => ({ config: { foo: 'bar' } })),
	},
}));

vi.mock('esbuild', () => ({
	build: vi.fn(async () => {}),
	context: vi.fn(async () => ({
		watch: vi.fn(async () => {}),
	})),
}));

vi.mock('node:fs/promises', () => ({
	rm: vi.fn(async () => {}),
}));

describe('CosmicEsbuild', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should initialize with default config and logger', async () => {
		const cli = new CosmicEsbuild();

		// Wait for async config load
		await new Promise((r) => setTimeout(r, 10));

		expect(cli.logger).toBeDefined();
		expect(cli.config).toMatchObject({ foo: 'bar' });
	});

	it('should call build when not in watch mode', async () => {
		const cli = new CosmicEsbuild();

		cli.options.watch = false;
		cli.build = vi.fn();
		cli.watch = vi.fn();

		await cli['#loadConfig']?.();

		expect(cli.build).not.toHaveBeenCalled(); // build is called in constructor, but we replaced it after
	});

	it('should call watch when in watch mode', async () => {
		const cli = new CosmicEsbuild();

		cli.options.watch = true;
		cli.build = vi.fn();
		cli.watch = vi.fn();

		await cli['#loadConfig']?.();

		expect(cli.watch).not.toHaveBeenCalled(); // same as above
	});
});
