# cosmic-esbuild

> Simplifying esbuild configurations in a familiar way.

[![License](https://img.shields.io/github/license/idleberg/cosmic-esbuild?color=blue&style=for-the-badge)](https://github.com/idleberg/cosmic-esbuild/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/cosmic-esbuild?style=for-the-badge)](https://www.npmjs.org/package/cosmic-esbuild)
[![CI: Node](https://img.shields.io/github/actions/workflow/status/idleberg/cosmic-esbuild/node.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/idleberg/cosmic-esbuild/actions/workflows/node.yml)

## Description

This package allows you declaratively configure `esbuild` using the popular [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig) format. No more custom build scripts, no more lengthy build commands in your manifest.

## Installation

```shell
npm install cosmic-esbuild
```

## Usage

### Configuration

Create a file for your configuration, see the following examples:

<details>
<summary><strong>JSON</strong></summary>

```json
{
	"bundle": true,
	"entryPoints": ["app.js"],
	"outdir": "lib",
	"sourcemap": "external"
}
```

</details>

<details>
<summary><strong>YAML</strong></summary>

```yaml
bundle: true
entryPoints:
  - "app.js"
outdir: "lib"
sourcemap: "external"
```

</details>

<details>
<summary><strong>TOML</strong></summary>

```toml
bundle = true
entryPoints = [ "app.js" ]
outdir = "lib"
sourcemap = "external"
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import type { BuildOptions } from "esbuild";

const config = {
	bundle: true,
	entryPoints: ["app.js"],
	outdir: "dist",
	sourcemap: "external",
} satisfies BuildOptions;

export default config;
```

</details>

<details>
<summary><code>package.json</code></summary>

This is an extended example that also includes possible scripts

```json
{
	"name": "your-package",
	"scripts": {
		"build": "cosmic-esbuild",
		"dev": "cosmic-esbuild --watch"
	},
	"esbuild": {
		"bundle": true,
		"entryPoints": ["app.js"],
		"outdir": "lib",
		"sourcemap": "external"
	}
}
```

</details>

### Supported formats

You can write your configuration to any of the following formats (sorted by precedence):

- `package.json` (add the `esbuild` property with your config)
- `.esbuildrc` (JSON or YAML)
- `.esbuildrc.json`
- `.esbuildrc.jsonc`
- `.esbuildrc.yaml`
- `.esbuildrc.yml`
- `.esbuildrc.toml`
- `esbuild.config.json`
- `esbuild.config.jsonc`
- `esbuild.config.yaml`
- `esbuild.config.yml`
- `esbuild.config.toml`
- `esbuild.config.js`
- `esbuild.config.ts`
- `esbuild.config.cjs`
- `esbuild.config.mjs`

### CLI

```sh
# Build, auto-load config
npx cosmic-esbuild

# Build, specify config
npx cosmic-esbuild --config esbuild.config.ts

# Watch
npx cosmic-esbuild --watch
```

## License

This work is licensed under [The MIT License](LICENSE).
