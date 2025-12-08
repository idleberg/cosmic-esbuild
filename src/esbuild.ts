import { rm } from 'node:fs/promises';
import { relative } from 'node:path';
import { cwd, exit } from 'node:process';
import type { OptionValues } from 'commander';
import { colorize } from 'consola/utils';
import { type BuildOptions, build, context, type Plugin } from 'esbuild';
import { explorer } from './cosmiconfig.ts';
import { logger } from './log.ts';

const defaultBuildOptions: BuildOptions = {
	outdir: cwd(),
};

export class CosmicEsbuild {
	config = {} as BuildOptions;
	options = {} as OptionValues;
	entryPoints: string[] = [];

	constructor(args?: string[], options?: OptionValues) {
		this.entryPoints = args ?? [];
		this.options = options ?? {};

		this.#loadConfig()
			.then(async (config) => {
				if (!config.entryPoints) {
					throw new Error('No entrypoints have been defined.');
				}

				this.config = config;

				if (this.options.debug) {
					logger.debug('esbuild Options:', config);
				}

				if (this.options.watch) {
					await this.watch();
				} else {
					await this.build();
				}
			})
			.catch((error) => logger.error((error as Error).message));
	}

	async #loadConfig(): Promise<BuildOptions> {
		try {
			const result = this.options.config ? await explorer.load(this.options.config) : await explorer.search();

			if (result === null) {
				logger.warn('No configuration file found.');
			} else if (result.isEmpty) {
				logger.warn('Configuration file is empty.');
			} else {
				const configPath = relative(cwd(), result.filepath);

				logger.info(`Found config at ${colorize('blue', configPath)}`);
			}

			const options = {
				...defaultBuildOptions,
				...result?.config,
			};

			if (this.entryPoints.length) {
				options.entryPoints = this.entryPoints;
			}

			// Basic options
			if (this.options.bundle) {
				options.bundle = this.options.bundle;
			}

			if (this.options.define) {
				options.define = Object.fromEntries(this.options.define.map((item: string) => item.split('=')));
			}

			if (this.options.external) {
				options.external = this.options.external;
			}

			// TODO refine types
			if (typeof this.options.format === 'string') {
				options.external = this.options.format;
			}

			if (this.options.loader) {
				options.loader = Object.fromEntries(this.options.define.map((item: string) => item.split('=')));
			}

			if (this.options.minify) {
				options.minify = this.options.minify;
			}

			if (typeof this.options.outdir === 'string') {
				options.outdir = this.options.outdir;
			}

			if (typeof this.options.outfile === 'string') {
				options.outfile = this.options.outfile;
			}

			if (this.options.packages) {
				options.packages = this.options.packages;
			}

			if (this.options.sourcemap) {
				options.sourcemap = this.options.sourcemap;
			}

			if (this.options.splitting) {
				options.splitting = this.options.splitting;
			}

			if (this.options.target) {
				options.target = this.options.target;
			}

			// Advanced Options
			if (this.options.allowOverwrite) {
				options.allowOverwrite = this.options.allowOverwrite;
			}

			return options;
		} catch (error) {
			// Found configuration file, but an error occurred while parsing it.
			logger.error('Error loading configuration:', (error as Error).message);
			exit(1);
		}
	}

	async #clean() {
		if (this.options.clean && typeof this.config.outdir === 'string') {
			logger.info('Cleaning output directory...');
			await rm(this.config.outdir, { force: true, recursive: true });
		}
	}

	async build() {
		console.log(/* let it breathe */);

		await this.#clean();

		const start = performance.now();

		try {
			await build(this.config);
		} catch {
			// an error should have printed by now, let's return quietly
			return;
		}

		const end = performance.now();
		const duration = ((end - start) / 1000).toFixed(3);

		logger.success(`Build completed in ${duration}s`);
	}

	async watch() {
		// const logger = logger;
		const clean = this.#clean.bind(this);

		const watcher: Plugin = {
			name: 'cosmic-esbuild-watcher',
			setup(build) {
				console.log(/* let it breathe */);

				build.onStart(async () => {
					await clean();
					logger.info('Build started');
				});

				build.onEnd(() => {
					logger.info('Build finished, watching for changes...');
				});
			},
		};

		const ctx = await context({
			...this.config,
			plugins: [watcher],
		});

		await ctx.watch({});
	}
}
