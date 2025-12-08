import { createConsola } from 'consola';
import { describe, expect, it, vi } from 'vitest';
import { logger } from './log.ts';

vi.mock('consola', () => ({
	createConsola: vi.fn(() => ({
		log: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		success: vi.fn(),
	})),
}));

describe('logger', () => {
	it('should be created with correct configuration', () => {
		expect(createConsola).toHaveBeenCalledWith({
			level: 4,
			formatOptions: {
				compact: true,
				date: true,
			},
		});
	});

	it('should export a logger instance', () => {
		expect(logger).toBeDefined();
		expect(logger).toHaveProperty('log');
		expect(logger).toHaveProperty('info');
		expect(logger).toHaveProperty('debug');
		expect(logger).toHaveProperty('error');
		expect(logger).toHaveProperty('warn');
		expect(logger).toHaveProperty('success');
	});
});
