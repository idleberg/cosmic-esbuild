import { describe, expect, it } from 'vitest';
import { jsoncLoader, tomlLoader } from '../src/cosmiconfig.ts';

describe('tomlLoader', () => {
	it('parses valid TOML', () => {
		const content = 'foo = "bar"\nnum = 42';
		const result = tomlLoader('test.toml', content);

		expect(result).toEqual({ foo: 'bar', num: 42 });
	});

	it('throws on invalid TOML', () => {
		const content = 'foo = ';

		expect(() => tomlLoader('bad.toml', content)).toThrow(/Error parsing TOML file/);
	});
});

describe('jsoncLoader', () => {
	it('parses valid JSONC', () => {
		const content = '{ "foo": "bar", /* comment */ "num": 42 }';
		const result = jsoncLoader('test.jsonc', content);

		expect(result).toEqual({ foo: 'bar', num: 42 });
	});

	it('throws on invalid JSONC', () => {
		const content = '{ foo: }';

		expect(() => jsoncLoader('bad.jsonc', content)).toThrow(/Error parsing JSONC file/);
	});
});
