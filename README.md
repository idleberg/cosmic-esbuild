# cosmic-esbuild

> Simplifying esbuild configurations in a familiar way.

[![License](https://img.shields.io/github/license/idleberg/cosmic-esbuild?color=blue&style=for-the-badge)](https://github.com/idleberg/cosmic-esbuild/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/cosmic-esbuild?style=for-the-badge)](https://www.npmjs.org/package/cosmic-esbuild)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/cosmic-esbuild/main?style=for-the-badge)

## Description

This package allows you to declaratively configure `esbuild` using the popular [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig) format. No more custom build scripts, no more lengthy build commands in your manifest.

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

> [!NOTE]
> The CLI should primarily be used with configuration files. However, some of the basic esbuild options can be passed as command-line arguments. It's not a goal of this project to replicate esbuild's CLI functionality.

For a full list of command-line arguments, run `npx cosmic-build --help`.

## License

This work is licensed under [The MIT License](LICENSE).
