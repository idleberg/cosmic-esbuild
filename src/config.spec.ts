import { describe, expect, it } from 'vitest';
import { defineConfig } from './config.ts';

describe('defineConfig', () => {
	it('returns the config object unchanged', () => {
		const config = {
			entryPoints: ['src/index.ts'],
			bundle: true,
			outfile: 'dist/bundle.js',
		};

		const result = defineConfig(config);

		expect(result).toEqual(config);
		expect(result).toBe(config);
	});

	it('handles empty config object', () => {
		const config = {};
		const result = defineConfig(config);

		expect(result).toEqual({});
		expect(result).toBe(config);
	});
});
