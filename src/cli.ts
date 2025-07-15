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
				writeErr: (message) => this.logger.error(message),
			})
			.option('-c, --config <file>', 'Path to the configuration file')
			.option('-w, --watch', 'Run in watch mode', false)
			.option('--clean', 'Clean output directory before building', false)
			.option('--debug', 'Enable debug output', false)

			// ESbuild simple options
			.optionsGroup('ESBuild: Simple Options')
			.option('--bundle', 'Bundle all dependencies into the output files')
			.option('--define <K=V...>', 'Substitute K with V while parsing')
			.option('--external <module...>', 'Exclude module M from the bundle')
			.option('--format <iife|cjs|esm>', 'Output format')
			.option('--loader <X=L>', 'Use loader L to load file extension X')
			.option('--minify', 'Minify the output')
			.option('--outdir', 'The output directory (for multiple entry points)')
			.option('--outfile', 'The output file (for one entry point)')
			.option('--packages <bundle|external>', 'Set to "external" to avoid bundling any package')
			.option('--sourcemap', 'Emit a source map')
			.option('--splitting', 'Enable code splitting')
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

			if (typeof this.options.bundle !== 'undefined') {
				options.bundle = this.options.bundle;
			}

			if (this.options.define) {
				options.define = Object.fromEntries(this.options.define.map((item: string) => item.split('=')));
			}

			if (this.options.external) {
				options.external = this.options.external;
			}

			// TODO refine types
			if (this.options.format) {
				options.external = this.options.format;
			}

			if (this.options.loader) {
				options.loader = Object.fromEntries(this.options.define.map((item: string) => item.split('=')));
			}

			if (typeof this.options.minify !== 'undefined') {
				options.minify = this.options.minify;
			}

			if (typeof this.options.outdir !== 'undefined') {
				options.outdir = this.options.outdir;
			}

			if (typeof this.options.outfile !== 'undefined') {
				options.outfile = this.options.outfile;
			}

			if (this.options.packages) {
				options.packages = this.options.packages;
			}

			if (typeof this.options.sourcemap !== 'undefined') {
				options.sourcemap = this.options.sourcemap;
			}

			if (typeof this.options.splitting !== 'undefined') {
				options.splitting = this.options.splitting;
			}

			if (this.options.target) {
				options.target = this.options.target;
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
		await build(this.config);

		this.logger.success('Build completed');
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
