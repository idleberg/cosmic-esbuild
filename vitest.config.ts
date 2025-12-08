import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/*.spec.ts'],
		coverage: {
			exclude: ['src/index.*.ts', 'src/main.ts'],
			include: ['src/*.ts'],
		},
		onConsoleLog: () => false,
	},
});
