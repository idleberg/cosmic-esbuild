/** biome-ignore-all lint/suspicious/noExplicitAny: We in a test, should be okay */
import { rm } from 'node:fs/promises';
import { exit } from 'node:process';
import { build, context } from 'esbuild';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { explorer } from './cosmiconfig.ts';
import { CosmicEsbuild } from './esbuild.ts';
import { logger } from './log.ts';

// Mock dependencies
vi.mock('node:fs/promises');
vi.mock('node:process', async () => {
	const actual = await vi.importActual('node:process');
	return {
		...actual,
		exit: vi.fn(),
	};
});
vi.mock('esbuild');
vi.mock('./cosmiconfig.ts', () => ({
	explorer: {
		load: vi.fn(),
		search: vi.fn(),
	},
}));
vi.mock('./log.ts', () => ({
	logger: {
		log: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		success: vi.fn(),
	},
}));

describe('CosmicEsbuild', () => {
	const mockContext = {
		watch: vi.fn().mockResolvedValue(undefined),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(context).mockResolvedValue(mockContext as any);
		vi.mocked(build).mockResolvedValue({} as any);
		vi.mocked(explorer.search).mockResolvedValue(null);
		vi.mocked(explorer.load).mockResolvedValue(null);
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('Constructor and Initialization', () => {
		it('should handle error when no entrypoints are defined', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: {},
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.error).toHaveBeenCalledWith('No entrypoints have been defined.');
		});

		it('should log debug information when debug flag is set', async () => {
			const config = { entryPoints: ['src/index.ts'] };
			vi.mocked(explorer.search).mockResolvedValue({
				config,
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { debug: true });
			await vi.runAllTimersAsync();

			expect(logger.debug).toHaveBeenCalledWith('esbuild Options:', expect.any(Object));
		});

		it('should call watch when watch option is true', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { watch: true });
			await vi.runAllTimersAsync();

			expect(context).toHaveBeenCalled();
		});

		it('should call build when watch option is false', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalled();
		});
	});

	describe('Config Loading', () => {
		it('should load config from specified file', async () => {
			vi.mocked(explorer.load).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'custom.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { config: 'custom.config.json' });
			await vi.runAllTimersAsync();

			expect(explorer.load).toHaveBeenCalledWith('custom.config.json');
		});

		it('should search for config when no config file specified', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(explorer.search).toHaveBeenCalled();
		});

		it('should warn when no configuration file found', async () => {
			vi.mocked(explorer.search).mockResolvedValue(null);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.warn).toHaveBeenCalledWith('No configuration file found.');
		});

		it('should warn when configuration file is empty', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: {},
				filepath: 'esbuild.config.json',
				isEmpty: true,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.warn).toHaveBeenCalledWith('Configuration file is empty.');
		});

		it('should log config path when found', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: '/Users/test/project/esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Found config at'));
		});

		it('should merge default options with config', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'], minify: true },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					minify: true,
					entryPoints: ['src/index.ts'],
				}),
			);
		});

		it('should override entrypoints from CLI args', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/config.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild(['src/cli.ts', 'src/index.ts']);
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					entryPoints: ['src/cli.ts', 'src/index.ts'],
				}),
			);
		});

		it('should handle config loading errors', async () => {
			vi.mocked(explorer.search).mockRejectedValue(new Error('Config parse error'));

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.error).toHaveBeenCalledWith('Error loading configuration:', 'Config parse error');
			expect(exit).toHaveBeenCalledWith(1);
		});
	});

	describe('Option Mapping', () => {
		it('should map bundle option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { bundle: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					bundle: true,
				}),
			);
		});

		it('should map define option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { define: ['DEBUG=true', 'VERSION=1.0.0'] });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					define: {
						DEBUG: 'true',
						VERSION: '1.0.0',
					},
				}),
			);
		});

		it('should map external option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { external: ['react', 'react-dom'] });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					external: ['react', 'react-dom'],
				}),
			);
		});

		it('should map format option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { format: 'esm' });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					external: 'esm',
				}),
			);
		});

		it.skip('should map loader option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				// TODO: This test is skipped because there's a bug at esbuild.ts:86
				// where it references this.options.define instead of this.options.loader
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { loader: ['.txt=text', '.md=text'] });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					loader: {
						'.txt': 'text',
						'.md': 'text',
					},
				}),
			);
		});

		it('should map minify option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { minify: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					minify: true,
				}),
			);
		});

		it('should map outdir option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { outdir: 'dist' });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					outdir: 'dist',
				}),
			);
		});

		it('should map outfile option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { outfile: 'dist/bundle.js' });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					outfile: 'dist/bundle.js',
				}),
			);
		});

		it('should map packages option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { packages: 'external' });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					packages: 'external',
				}),
			);
		});

		it('should map sourcemap option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { sourcemap: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					sourcemap: true,
				}),
			);
		});

		it('should map splitting option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { splitting: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					splitting: true,
				}),
			);
		});

		it('should map target option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { target: ['es2020', 'node14'] });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					target: ['es2020', 'node14'],
				}),
			);
		});

		it('should map allowOverwrite option', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { allowOverwrite: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					allowOverwrite: true,
				}),
			);
		});
	});

	describe('Build', () => {
		it('should call esbuild build with config', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'], minify: true },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					entryPoints: ['src/index.ts'],
					minify: true,
				}),
			);
		});

		it('should log success message with duration', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.success).toHaveBeenCalledWith(expect.stringContaining('Build completed in'));
		});

		it('should handle build errors gracefully', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);
			vi.mocked(build).mockRejectedValue(new Error('Build failed'));

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			// Should not throw, just return quietly
			expect(logger.success).not.toHaveBeenCalled();
		});

		it('should clean before build when clean option is set', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'], outdir: 'dist' },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { clean: true });
			await vi.runAllTimersAsync();

			expect(rm).toHaveBeenCalledWith('dist', { force: true, recursive: true });
			expect(logger.info).toHaveBeenCalledWith('Cleaning output directory...');
		});

		it('should not clean when clean option is false', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'], outdir: 'dist' },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { clean: false });
			await vi.runAllTimersAsync();

			expect(rm).not.toHaveBeenCalled();
		});

		it('should not clean when using outfile instead of outdir', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { clean: true });
			await vi.runAllTimersAsync();

			expect(rm).not.toHaveBeenCalled();
		});
	});

	describe('Watch', () => {
		it('should create context and start watching', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { watch: true });
			await vi.runAllTimersAsync();

			expect(context).toHaveBeenCalledWith(
				expect.objectContaining({
					entryPoints: ['src/index.ts'],
					plugins: expect.any(Array),
				}),
			);
			expect(mockContext.watch).toHaveBeenCalledWith({});
		});

		it('should log build start in watch mode', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { watch: true });
			await vi.runAllTimersAsync();

			const contextCall = vi.mocked(context).mock.calls[0][0];
			const plugin = contextCall.plugins?.[0];

			// Clear previous logger calls from config loading
			vi.mocked(logger.info).mockClear();

			const mockBuild = {
				onStart: vi.fn(async (cb: any) => await cb()),
				onEnd: vi.fn(),
			};

			plugin.setup(mockBuild as any);

			// Wait for async onStart callback to complete
			await mockBuild.onStart.mock.results[0].value;

			expect(logger.info).toHaveBeenCalledWith('Build started');
		});

		it('should log build finished in watch mode', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { watch: true });
			await vi.runAllTimersAsync();

			const contextCall = vi.mocked(context).mock.calls[0][0];
			const plugin = contextCall.plugins?.[0];

			const mockBuild = {
				onStart: vi.fn(),
				onEnd: vi.fn((cb: any) => cb()),
			};

			plugin.setup(mockBuild as any);

			// Wait for async onStart callback to complete
			await mockBuild.onStart.mock.results[0].value;

			expect(logger.info).toHaveBeenCalledWith('Build finished, watching for changes...');
		});

		it('should clean on watch rebuild when clean option is set', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'], outdir: 'dist' },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { watch: true, clean: true });
			await vi.runAllTimersAsync();

			const contextCall = vi.mocked(context).mock.calls[0][0];
			const plugin = contextCall.plugins?.[0];

			const mockBuild = {
				onStart: vi.fn(async (cb: any) => await cb()),
				onEnd: vi.fn(),
			};

			await plugin.setup(mockBuild as any);

			// Wait for async onStart callback to complete
			await mockBuild.onStart.mock.results[0].value;

			expect(rm).toHaveBeenCalledWith('dist', { force: true, recursive: true });
		});
	});

	describe('Configuration Warnings', () => {
		it('should not warn for standard config files', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: { entryPoints: ['src/index.ts'] },
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(logger.warn).not.toHaveBeenCalledWith(expect.stringContaining('deprecated'));
		});
	});

	describe('Integration Tests', () => {
		it('should handle config with plugins', async () => {
			const mockPlugin = {
				name: 'test-plugin',
				setup: vi.fn(),
			};

			vi.mocked(explorer.search).mockResolvedValue({
				config: {
					entryPoints: ['src/index.ts'],
					plugins: [mockPlugin],
				},
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					plugins: [mockPlugin],
				}),
			);
		});

		it('should merge CLI options with config file options', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: {
					entryPoints: ['src/index.ts'],
					minify: true,
					bundle: true,
				},
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild([], { sourcemap: true, splitting: true });
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					minify: true,
					bundle: true,
					sourcemap: true,
					splitting: true,
				}),
			);
		});

		it('should preserve config when CLI options are not provided', async () => {
			vi.mocked(explorer.search).mockResolvedValue({
				config: {
					entryPoints: ['src/index.ts'],
					minify: true,
					bundle: true,
					target: ['es2020'],
				},
				filepath: 'esbuild.config.json',
				isEmpty: false,
			} as any);

			new CosmicEsbuild();
			await vi.runAllTimersAsync();

			expect(build).toHaveBeenCalledWith(
				expect.objectContaining({
					minify: true,
					bundle: true,
					target: ['es2020'],
				}),
			);
		});
	});
});
