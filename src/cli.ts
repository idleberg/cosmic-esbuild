import { rm } from 'node:fs/promises';
import { type OptionValues, program } from 'commander';
import { type ConsolaInstance, createConsola } from 'consola';
import { type BuildOptions, type Plugin, build, context } from 'esbuild';
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
			.option('--debug', 'Enable debug output', false);

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

			return {
				...defaultBuildOptions,
				...result.config,
			};
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
