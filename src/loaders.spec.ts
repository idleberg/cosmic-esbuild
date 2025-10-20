import { describe, expect, it } from 'vitest';
import { csonLoader, jsoncLoader, tomlLoader } from './loaders.ts';

describe('csonLoader', () => {
	it('parses valid CSON', () => {
		const content = 'foo: "bar"\nnum: 42';
		const result = csonLoader('test.cson', content);

		expect(result).toEqual({ foo: 'bar', num: 42 });
	});

	it('throws on invalid CSON', () => {
		const content = 'foo: ';

		expect(() => csonLoader('bad.cson', content)).toThrow(/Error parsing CSON file/);
	});
});

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
