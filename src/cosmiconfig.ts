import { cosmiconfig } from 'cosmiconfig';
import { TypeScriptLoader as tsLoader } from 'cosmiconfig-typescript-loader';
import { csonLoader, json5Loader, jsoncLoader, tomlLoader } from './loaders.ts';

const MODULE_NAME = 'esbuild';

export const explorer = cosmiconfig(MODULE_NAME, {
	searchPlaces: [
		// manifest
		'package.json',

		// runcom files
		`.${MODULE_NAME}rc`,
		`.${MODULE_NAME}rc.json`,
		`.${MODULE_NAME}rc.json5`,
		`.${MODULE_NAME}rc.jsonc`,
		`.${MODULE_NAME}rc.yaml`,
		`.${MODULE_NAME}rc.yml`,
		`.${MODULE_NAME}rc.toml`,
		`.${MODULE_NAME}rc.js`,
		`.${MODULE_NAME}rc.ts`,
		`.${MODULE_NAME}rc.cjs`,
		`.${MODULE_NAME}rc.mjs`,
		`.${MODULE_NAME}rc.cts`,
		`.${MODULE_NAME}rc.mts`,
		`.${MODULE_NAME}rc.cson`,

		// .config folder
		`.config/${MODULE_NAME}rc`,
		`.config/${MODULE_NAME}rc.json`,
		`.config/${MODULE_NAME}rc.json5`,
		`.config/${MODULE_NAME}rc.jsonc`,
		`.config/${MODULE_NAME}rc.yaml`,
		`.config/${MODULE_NAME}rc.yml`,
		`.config/${MODULE_NAME}rc.toml`,
		`.config/${MODULE_NAME}rc.js`,
		`.config/${MODULE_NAME}rc.ts`,
		`.config/${MODULE_NAME}rc.cjs`,
		`.config/${MODULE_NAME}rc.mjs`,
		`.config/${MODULE_NAME}rc.cts`,
		`.config/${MODULE_NAME}rc.mts`,
		`.config/${MODULE_NAME}rc.cson`,

		// config files
		`${MODULE_NAME}.config.json`,
		`${MODULE_NAME}.config.json5`,
		`${MODULE_NAME}.config.jsonc`,
		`${MODULE_NAME}.config.yaml`,
		`${MODULE_NAME}.config.yml`,
		`${MODULE_NAME}.config.toml`,
		`${MODULE_NAME}.config.js`,
		`${MODULE_NAME}.config.ts`,
		`${MODULE_NAME}.config.cjs`,
		`${MODULE_NAME}.config.mjs`,
		`${MODULE_NAME}.config.cts`,
		`${MODULE_NAME}.config.mts`,
		`${MODULE_NAME}.config.cson`,
	],
	loaders: {
		'.cson': csonLoader,

		// allow JSONC in plain JSON files
		'.json': jsoncLoader,

		'.json5': json5Loader,
		'.jsonc': jsoncLoader,

		'.ts': tsLoader(),
		'.cts': tsLoader(),
		'.mts': tsLoader(),

		'.toml': tomlLoader,
	},
});
