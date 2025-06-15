import TOML from '@iarna/toml';
import { cosmiconfig } from 'cosmiconfig';
import JSONC, { type ParseError } from 'jsonc-parser';

const moduleName = 'esbuild';

export function tomlLoader(filePath: string, content: string): TOML.JsonMap {
	try {
		return TOML.parse(content);
	} catch (error) {
		throw new Error(`Error parsing TOML file at ${filePath}: ${(error as Error).message}`);
	}
}

export function jsoncLoader(filePath: string, content: string): ReturnType<typeof JSONC.parse> {
	const errors: ParseError[] = [];
	const result = JSONC.parse(content, errors);

	// JSONC.parse does not throw on errors, it returns an array of errors
	if (errors.length > 0) {
		const firstError = errors[0];
		const errorCode = firstError ? JSONC.printParseErrorCode(firstError.error) : 'Unknown error';

		throw new Error(`Error parsing JSONC file at ${filePath}: ${errorCode}`);
	}

	return result;
}

export const explorer = cosmiconfig(moduleName, {
	searchPlaces: [
		// manifest
		'package.json',

		// runcom files
		`.${moduleName}rc`,
		`.${moduleName}rc.json`,
		`.${moduleName}rc.jsonc`,
		`.${moduleName}rc.yaml`,
		`.${moduleName}rc.yml`,
		`.${moduleName}rc.toml`,

		// config files
		`${moduleName}.config.json`,
		`${moduleName}.config.jsonc`,
		`${moduleName}.config.yaml`,
		`${moduleName}.config.yml`,
		`${moduleName}.config.toml`,
		`${moduleName}.config.js`,
		`${moduleName}.config.ts`,
		`${moduleName}.config.cjs`,
		`${moduleName}.config.mjs`,
	],
	loaders: {
		// allow JSONC in plain JSON files
		'.json': jsoncLoader,
		'.jsonc': jsoncLoader,
		'.toml': tomlLoader,
	},
});
