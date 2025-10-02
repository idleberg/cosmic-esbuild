import { rm } from 'node:fs/promises';
import { type OptionValues, program } from 'commander';
import { type ConsolaInstance, createConsola } from 'consola';
import { type BuildOptions, build, context, type Plugin } from 'esbuild';
import { explorer } from './cosmiconfig.ts';

const defaultBuildOptions: BuildOptions = {
	outdir: process.cwd(),
};

export class CosmicEsbuild {
	config: BuildOptions = {} as BuildOptions;
	logger: ConsolaInstance;
	options: OptionValues;

	constructor() {
		this.logger = this.#createLogger();
		this.options = this.#parseOptions();

		this.#loadConfig().then(async (config) => {
			this.config = config;

			if (this.options.debug) {
				this.logger.debug('esbuild Options:', config);
			}

			if (this.options.watch) {
				await this.watch();
			} else {
				await this.build();
			}
		});
	}

	#parseOptions(): OptionValues {
		program
			.configureOutput({
				writeErr: (message: string) => this.logger.error(message),
			})
			.optionsGroup('Cosmic Options')
			.option('-c, --config <file>', 'Path to the configuration file')
			.option('-w, --watch', 'Run in watch mode', false)
			.option('--clean', 'Clean output directory before building', false)
			.option('--debug', 'Enable debug output', false)

			.optionsGroup('esbuild Options')
			.option('--allow-overwrite', 'Allow output files to overwrite input files', false)
			.option('--bundle', 'Bundle all dependencies into the output files', false)
			.option('--define <K=V...>', 'Substitute K with V while parsing')
			.option('--external <module...>', 'Exclude module M from the bundle')
			.option('--format <iife|cjs|esm>', 'Output format')
			.option('--loader <X=L>', 'Use loader L to load file extension X')
			.option('--minify', 'Minify the output', false)
			.option('--outdir', 'The output directory (for multiple entry points)')
			.option('--outfile', 'The output file (for one entry point)')
			.option('--packages <bundle|external>', 'Set to "external" to avoid bundling any package')
			.option('--sourcemap', 'Emit a source map', false)
			.option('--splitting', 'Enable code splitting', false)
			.option('--tsconfig <file>', ' Use this tsconfig.json file instead of other one')
			.option('--target <target...>', 'Environment target');

		program.parse();
		const options = program.opts();

		if (options.debug) {
			this.logger.debug('CLI Options:', program.opts());
		}

		return options;
	}

	#createLogger() {
		return createConsola({
			level: 4,
			formatOptions: {
				compact: true,
				date: true,
			},
		});
	}

	async #loadConfig(): Promise<BuildOptions> {
		try {
			const result = this.options.config ? await explorer.load(this.options.config) : await explorer.search();

			if (result === null) {
				this.logger.warn('No configuration file found.');

				return defaultBuildOptions;
			}

			const options = {
				...defaultBuildOptions,
				...result.config,
			};

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

			if (typeof this.options.tsconfig === 'string') {
				options.tsconfig = this.options.tsconfig;
			}

			return options;
		} catch (error) {
			// Found configuration file, but an error occurred while parsing it.
			this.logger.error('Error loading configuration:', (error as Error).message);
			process.exit(1);
		}
	}

	async #clean() {
		if (this.options.clean && typeof this.config.outdir === 'string') {
			this.logger.info('Cleaning output directory...');
			await rm(this.config.outdir, { force: true, recursive: true });
		}
	}

	async build() {
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

		this.logger.success(`Build completed in ${duration}s`);
	}

	async watch() {
		const logger = this.logger;
		const clean = this.#clean.bind(this);

		const watcher: Plugin = {
			name: 'cosmic-esbuild-watcher',
			setup(build) {
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
