import { type JSONCParseError, parseJSON5, parseJSONC, parseTOML } from 'confbox';
import CSON from 'cson-parser';

/**
 * Loader for CSON files.
 * @internal
 */
export function csonLoader(filePath: string, content: string) {
	try {
		return CSON.parse(content);
	} catch (error) {
		throw new Error(`Error parsing CSON file at ${filePath}: ${(error as Error).message}`);
	}
}

/**
 * Loader for TOML files.
 * @internal
 */
export function tomlLoader(filePath: string, content: string): unknown {
	try {
		return parseTOML(content);
	} catch (error) {
		throw new Error(`Error parsing TOML file at ${filePath}: ${(error as Error).message}`);
	}
}

/**
 * Loader for JSON5 files, adding simple error handling.
 * @internal
 */
export function json5Loader(filePath: string, content: string): unknown {
	try {
		return parseJSON5(content);
	} catch (error) {
		throw new Error(`Error parsing JSON5 file at ${filePath}: ${(error as Error).message}`);
	}
}

/**
 * Loader for JSONC files, adding simple error handling.
 * @internal
 */
export function jsoncLoader(filePath: string, content: string): unknown {
	const errors: JSONCParseError[] = [];
	const result = parseJSONC(content, { errors });

	// Does not throw on errors, it returns an array of errors
	if (errors.length > 0) {
		const firstError = errors[0];
		const errorCode = firstError ? firstError.error : 'Unknown error';

		throw new Error(`Error parsing JSONC file at ${filePath}: ${errorCode}`);
	}

	return result;
}
