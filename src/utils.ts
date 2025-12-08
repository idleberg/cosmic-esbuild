/**
 * Loads version from package manifest.
 * @internal
 */
export async function getVersion(): Promise<string> {
	// The JSR package will only contain jsr.json, hence this unfortunate differentation is required.
	const module = 'Deno' in globalThis ? await loadJsrManifest() : await loadNpmManifest();

	return module.default.version ?? 'development';
}

function loadJsrManifest() {
	return import('../deno.json', {
		with: { type: 'json' },
	});
}

function loadNpmManifest() {
	return import('../package.json', {
		with: { type: 'json' },
	});
}
