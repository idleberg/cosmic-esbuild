import TOML from '@iarna/toml';
import CSON from 'cson-parser';
import JSONC, { type ParseError } from 'jsonc-parser';

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
