import { Command } from 'commander';
import { logger } from './log.ts';
import { getVersion } from './utils.ts';

/**
 * Handles parsing of CLI arguments.
 * @internal
 */
export async function handleCli() {
	const program = new Command('cosmic-esbuild');

	program
		.version(await getVersion())
		.configureOutput({
			writeOut: (message: string) => logger.log(message),
			writeErr: (message: string) => logger.error(message),
		})
		.optionsGroup('Cosmic Options')
		.option('-c, --config <file>', 'Path to the configuration file')
		.option('-w, --watch', 'Run in watch mode', false)
		.option('--clean', 'Clean output directory before building', false)
		.option('--debug', 'Enable debug output', false)

		.optionsGroup('esbuild Basic Options')
		.option('--bundle', 'Bundle all dependencies into the output files', false)
		.option('--define <K=V...>', 'Substitute K with V while parsing')
		.option('--external <module...>', 'Exclude module M from the bundle')
		.option('--format <iife|cjs|esm>', 'Output format')
		.option('--loader <X=L>', 'Use loader L to load file extension X')
		.option('--minify', 'Minify the output', false)
		.option('--outdir <directory>', 'The output directory (for multiple entry points)', 'dist')
		.option('--outfile <file>', 'The output file (for one entry point)')
		.option('--packages <bundle|external>', 'Set to "external" to avoid bundling any package')
		.option('--sourcemap', 'Emit a source map', false)
		.option('--splitting', 'Enable code splitting', false)
		.option('--target <target...>', 'Environment target')

		.optionsGroup('esbuild Advanced Options')
		.option('--allow-overwrite', 'Allow output files to overwrite input files', false)

		.argument('[entrypoints...]');

	program.parse();

	const args = program.args;
	const options = program.opts();

	if (options.debug) {
		logger.debug('CLI Options:', options);
		logger.debug('CLI Entrypoints:', args);
	}

	return {
		args,
		options,
	};
}
