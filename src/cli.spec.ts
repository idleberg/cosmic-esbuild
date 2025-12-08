import type { Command } from 'commander';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleCli } from './cli.ts';
import { logger } from './log.ts';

// Create mock program instance with proper typing
const mockProgram = {
	version: vi.fn().mockReturnThis(),
	configureOutput: vi.fn().mockReturnThis(),
	optionsGroup: vi.fn().mockReturnThis(),
	option: vi.fn().mockReturnThis(),
	argument: vi.fn().mockReturnThis(),
	parse: vi.fn().mockReturnThis(),
	opts: vi.fn(),
	args: [] as string[],
} satisfies Partial<Command>;

// Mock dependencies
vi.mock('commander', () => {
	class MockCommand {
		constructor() {
			Object.assign(this, mockProgram);
		}
	}
	return {
		Command: MockCommand,
	};
});

vi.mock('./log.ts', () => ({
	logger: {
		log: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock('./utils.ts', () => ({
	getVersion: vi.fn().mockResolvedValue('1.0.0'),
}));

describe('handleCli', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockProgram.opts.mockReturnValue({});
		mockProgram.args = [];
	});

	it('should set version', async () => {
		await handleCli();

		expect(mockProgram.version).toHaveBeenCalledWith('1.0.0');
	});

	it('should configure output handlers', async () => {
		await handleCli();

		expect(mockProgram.configureOutput).toHaveBeenCalledWith({
			writeOut: expect.any(Function),
			writeErr: expect.any(Function),
		});
	});

	it('should register Cosmic Options group', async () => {
		await handleCli();

		expect(mockProgram.optionsGroup).toHaveBeenCalledWith('Cosmic Options');
	});

	it('should register all Cosmic options', async () => {
		await handleCli();

		expect(mockProgram.option).toHaveBeenCalledWith('-c, --config <file>', 'Path to the configuration file');
		expect(mockProgram.option).toHaveBeenCalledWith('-w, --watch', 'Run in watch mode', false);
		expect(mockProgram.option).toHaveBeenCalledWith('--clean', 'Clean output directory before building', false);
		expect(mockProgram.option).toHaveBeenCalledWith('--debug', 'Enable debug output', false);
	});

	it('should register esbuild Basic Options group', async () => {
		await handleCli();

		expect(mockProgram.optionsGroup).toHaveBeenCalledWith('esbuild Basic Options');
	});

	it('should register all esbuild basic options', async () => {
		await handleCli();

		expect(mockProgram.option).toHaveBeenCalledWith('--bundle', 'Bundle all dependencies into the output files', false);
		expect(mockProgram.option).toHaveBeenCalledWith('--define <K=V...>', 'Substitute K with V while parsing');
		expect(mockProgram.option).toHaveBeenCalledWith('--external <module...>', 'Exclude module M from the bundle');
		expect(mockProgram.option).toHaveBeenCalledWith('--format <iife|cjs|esm>', 'Output format');
		expect(mockProgram.option).toHaveBeenCalledWith('--loader <X=L>', 'Use loader L to load file extension X');
		expect(mockProgram.option).toHaveBeenCalledWith('--minify', 'Minify the output', false);
		expect(mockProgram.option).toHaveBeenCalledWith(
			'--outdir <directory>',
			'The output directory (for multiple entry points)',
		);
		expect(mockProgram.option).toHaveBeenCalledWith('--outfile <file>', 'The output file (for one entry point)');
		expect(mockProgram.option).toHaveBeenCalledWith(
			'--packages <bundle|external>',
			'Set to "external" to avoid bundling any package',
		);
		expect(mockProgram.option).toHaveBeenCalledWith('--sourcemap', 'Emit a source map', false);
		expect(mockProgram.option).toHaveBeenCalledWith('--splitting', 'Enable code splitting', false);
		expect(mockProgram.option).toHaveBeenCalledWith('--target <target...>', 'Environment target');
	});

	it('should register esbuild Advanced Options group', async () => {
		await handleCli();

		expect(mockProgram.optionsGroup).toHaveBeenCalledWith('esbuild Advanced Options');
	});

	it('should register all esbuild advanced options', async () => {
		await handleCli();

		expect(mockProgram.option).toHaveBeenCalledWith(
			'--allow-overwrite',
			'Allow output files to overwrite input files',
			false,
		);
	});

	it('should register entrypoints argument', async () => {
		await handleCli();

		expect(mockProgram.argument).toHaveBeenCalledWith('[entrypoints...]');
	});

	it('should parse command line arguments', async () => {
		await handleCli();

		expect(mockProgram.parse).toHaveBeenCalled();
	});

	it('should return args and options', async () => {
		mockProgram.opts.mockReturnValue({ config: 'test.config.js' });
		mockProgram.args = ['src/index.ts', 'src/main.ts'];

		const result = await handleCli();

		expect(result).toEqual({
			args: ['src/index.ts', 'src/main.ts'],
			options: { config: 'test.config.js' },
		});
	});

	it('should log debug info when debug flag is set', async () => {
		const mockOptions = { debug: true, config: 'test.config.js' };
		const mockArgs = ['src/index.ts'];

		mockProgram.opts.mockReturnValue(mockOptions);
		mockProgram.args = mockArgs;

		await handleCli();

		expect(logger.debug).toHaveBeenCalledWith('CLI Options:', mockOptions);
		expect(logger.debug).toHaveBeenCalledWith('CLI Entrypoints:', mockArgs);
	});

	it('should not log debug info when debug flag is not set', async () => {
		const mockOptions = { config: 'test.config.js' };
		const mockArgs = ['src/index.ts'];

		mockProgram.opts.mockReturnValue(mockOptions);
		mockProgram.args = mockArgs;

		await handleCli();

		expect(logger.debug).not.toHaveBeenCalled();
	});

	it('should use logger.log for writeOut', async () => {
		await handleCli();

		const configureCall = mockProgram.configureOutput.mock.calls[0][0];
		configureCall.writeOut('test message');

		expect(logger.log).toHaveBeenCalledWith('test message');
	});

	it('should use logger.error for writeErr', async () => {
		await handleCli();

		const configureCall = mockProgram.configureOutput.mock.calls[0][0];
		configureCall.writeErr('error message');

		expect(logger.error).toHaveBeenCalledWith('error message');
	});

	it('should handle empty args and options', async () => {
		mockProgram.opts.mockReturnValue({});
		mockProgram.args = [];

		const result = await handleCli();

		expect(result).toEqual({
			args: [],
			options: {},
		});
	});

	it('should handle multiple entrypoints', async () => {
		mockProgram.args = ['src/index.ts', 'src/main.ts', 'src/worker.ts'];
		mockProgram.opts.mockReturnValue({});

		const result = await handleCli();

		expect(result.args).toEqual(['src/index.ts', 'src/main.ts', 'src/worker.ts']);
	});

	it('should handle all options being set', async () => {
		const allOptions = {
			config: 'custom.config.js',
			watch: true,
			clean: true,
			debug: true,
			bundle: true,
			define: ['DEBUG=true', 'VERSION=1.0.0'],
			external: ['react', 'react-dom'],
			format: 'esm',
			loader: ['.txt=text'],
			minify: true,
			outdir: 'dist',
			outfile: undefined,
			packages: 'external',
			sourcemap: true,
			splitting: true,
			target: ['es2020', 'node14'],
			allowOverwrite: true,
		};

		mockProgram.opts.mockReturnValue(allOptions);
		mockProgram.args = ['src/index.ts'];

		const result = await handleCli();

		expect(result.options).toEqual(allOptions);
		expect(result.args).toEqual(['src/index.ts']);
	});
});
