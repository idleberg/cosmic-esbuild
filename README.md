# cosmic-esbuild

> esbuild meets cosmiconfig, write your configs like you're used to.

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

You can write your configuration to any of the following formats (sorted by precedence):

- [`package.json`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/package.json)
- `.esbuildrc` (see JSON or YAML)
- [`.esbuildrc.json`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.json)
- [`.esbuildrc.jsonc`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.jsonc)
- [`.esbuildrc.yaml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`.esbuildrc.yml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`.esbuildrc.toml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.toml)
- [`.esbuildrc.js`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.js)
- [`.esbuildrc.ts`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.ts)
- [`.esbuildrc.cjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cjs)
- [`.esbuildrc.mjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.mjs)
- [`.esbuildrc.cson`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cson)
- `.config/esbuildrc` (see JSON or YAML)
- [`.config/esbuildrc.json`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.json)
- [`.config/esbuildrc.jsonc`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.jsonc)
- [`.config/esbuildrc.yaml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`.config/esbuildrc.yml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`.config/esbuildrc.toml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.toml)
- [`.config/esbuildrc.js`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.js)
- [`.config/esbuildrc.ts`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.ts)
- [`.config/esbuildrc.cjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cjs)
- [`.config/esbuildrc.mjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.mjs)
- [`.config/esbuildrc.cson`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cson)
- [`esbuild.config.json`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.json)
- [`esbuild.config.jsonc`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.jsonc)
- [`esbuild.config.yaml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`esbuild.config.yml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.yaml)
- [`esbuild.config.toml`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.toml)
- [`esbuild.config.js`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.js)
- [`esbuild.config.ts`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.ts)
- [`esbuild.config.cjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cjs)
- [`esbuild.config.mjs`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.mjs)
- [`esbuild.config.cson`](https://github.com/idleberg/cosmic-esbuild/blob/main/examples/esbuild.config.cson)

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
