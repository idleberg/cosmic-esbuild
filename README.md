# cosmic-esbuild

> esbuild meets cosmiconfig, write your configs like you're used to.

[![License](https://img.shields.io/github/license/idleberg/cosmic-esbuild?color=blue&style=for-the-badge)](https://github.com/idleberg/cosmic-esbuild/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/cosmic-esbuild?style=for-the-badge)](https://www.npmjs.org/package/cosmic-esbuild)
[![Version: jsr](https://img.shields.io/jsr/v/@idleberg/cosmic-esbuild?style=for-the-badge)](https://jsr.io/@idleberg/cosmic-esbuild)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/cosmic-esbuild/main?style=for-the-badge)

## Description

This package allows you to declaratively configure `esbuild` using the popular [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig) format. No more custom build scripts, no more lengthy build commands in your manifest.

## Installation

```shell
npm install cosmic-esbuild
```

## Usage

### Configuration

### CLI

> [!NOTE]
> The CLI should primarily be used with configuration files. However, some of the basic esbuild options can be passed as command-line arguments. It's not a goal of this project to replicate esbuild's CLI functionality.

```sh
# Build, auto-load config
npx cosmic-esbuild

# Build, specify config
npx cosmic-esbuild --config esbuild.config.ts

# Watch
npx cosmic-esbuild --watch
```

For a full list of command-line arguments, run `npx cosmic-build --help`.

#### Deno

Using Deno, you probably want to create tasks in your `deno.json` file:

> [!WARNING]
> The following example is simplied for brevity. You will likely need to define fine-grained permissions according to your needs. The important part is allowing to write to the `outDir` defined in your esbuild config.

```json
{
	"tasks": {
		"build": "deno run --allow-write='dist' jsr:@idleberg/cosmic-esbuild",
		"dev": "deno run --allow-write='dist' jsr:@idleberg/cosmic-esbuild --watch"
	}
}
```

### File Formats

You can write your configuration files in a number of formats. See the following examples (sorted by precedence):

<details>
<summary><strong>Example Configurations</strong></summary>

- [`package.json`][manifest]
- `.esbuildrc` (see [JSON][json] or [YAML][yaml])
- [`.esbuildrc.json`][json]
- [`.esbuildrc.jsonc`][jsonc]
- [`.esbuildrc.yaml`][yaml]
- [`.esbuildrc.yml`][yaml]
- [`.esbuildrc.toml`][toml]
- [`.esbuildrc.js`][js]
- [`.esbuildrc.ts`][js]
- [`.esbuildrc.cjs`][cjs]
- [`.esbuildrc.mjs`][js]
- [`.esbuildrc.cson`][cson]
- `.config/esbuildrc` (see [JSON][json] or [YAML][yaml])
- [`.config/esbuildrc.json`][json]
- [`.config/esbuildrc.jsonc`][jsonc]
- [`.config/esbuildrc.yaml`][yaml]
- [`.config/esbuildrc.yml`][yaml]
- [`.config/esbuildrc.toml`][toml]
- [`.config/esbuildrc.js`][js]
- [`.config/esbuildrc.ts`][js]
- [`.config/esbuildrc.cjs`][cjs]
- [`.config/esbuildrc.mjs`][js]
- [`.config/esbuildrc.cson`][cson]
- [`esbuild.config.json`][json]
- [`esbuild.config.jsonc`][jsonc]
- [`esbuild.config.yaml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`esbuild.config.yml`][yaml]
- [`esbuild.config.toml`][toml]
- [`esbuild.config.js`][js]
- [`esbuild.config.ts`][js]
- [`esbuild.config.cjs`][cjs]
- [`esbuild.config.mjs`][js]
- [`esbuild.config.cson`][cson]

</details>

## License

This work is licensed under [The MIT License](LICENSE).

[manifest]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/package.json
[json]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.json
[jsonc]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.jsonc
[yaml]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml
[toml]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.toml
[js]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.js
[ts]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.ts
[cjs]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cjs
[cson]: https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cson
