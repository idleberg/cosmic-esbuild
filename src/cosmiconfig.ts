import TOML from '@iarna/toml';
import { cosmiconfig } from 'cosmiconfig';
import CSON from 'cson-parser';
import JSONC, { type ParseError } from 'jsonc-parser';

const MODULE_NAME = 'esbuild';

export function csonLoader(filePath: string, content: string) {
	try {
		return CSON.parse(content);
	} catch (error) {
		throw new Error(`Error parsing CSON file at ${filePath}: ${(error as Error).message}`);
	}
}

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

export const explorer = cosmiconfig(MODULE_NAME, {
	searchPlaces: [
		// manifest
		'package.json',

		// runcom files
		`.${MODULE_NAME}rc`,
		`.${MODULE_NAME}rc.json`,
		`.${MODULE_NAME}rc.jsonc`,
		`.${MODULE_NAME}rc.yaml`,
		`.${MODULE_NAME}rc.yml`,
		`.${MODULE_NAME}rc.toml`,
		`.${MODULE_NAME}rc.cson`,

		// config files
		`${MODULE_NAME}.config.json`,
		`${MODULE_NAME}.config.jsonc`,
		`${MODULE_NAME}.config.yaml`,
		`${MODULE_NAME}.config.yml`,
		`${MODULE_NAME}.config.toml`,
		`${MODULE_NAME}.config.js`,
		`${MODULE_NAME}.config.ts`,
		`${MODULE_NAME}.config.cjs`,
		`${MODULE_NAME}.config.mjs`,
		`${MODULE_NAME}.config.cson`,
	],
	loaders: {
		'.cson': csonLoader,

		// allow JSONC in plain JSON files
		'.json': jsoncLoader,

		'.jsonc': jsoncLoader,
		'.toml': tomlLoader,
	},
});
