import { handleCli } from './cli.ts';
import { CosmicEsbuild } from './esbuild.ts';

export async function main() {
	const { args, options } = await handleCli();

	new CosmicEsbuild(args, options);
}
