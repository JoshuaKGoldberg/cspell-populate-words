<h1 align="center">CSpell Populate Words</h1>

<p align="center">Populates your cspell.json dictionary with existing unknown words. 🔖</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/cspell-populate-words/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/cspell-populate-words" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/cspell-populate-words?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/cspell-populate-words/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/cspell-populate-words"><img alt="📦 npm version" src="https://img.shields.io/npm/v/cspell-populate-words?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

Run `cspell-populate-words` as a command in your CLI to add any words currently reported by `cspell` as typos to the `words` array in your `cspell.json`.

```shell
npx cspell-populate-words "**/*"
```

If a `cspell.json` doesn't yet exist, one will be created for you.

If the `prettier` package is available, such as already being a dependency in your repository, it will be used to format the file.

### Options

`cspell-populate-words` takes in any non-zero number of file globs to look at.
The file globs are passed directly to the `cspell` CLI.

For example, to look at all files, and opt into `.github/`:

```shell
npx cspell \"**/*\" \".github/**/*\"
```

#### `--words`

Any number of `--words` can be provided along with -or instead of- positional file globs.
These words will be passed to [`cspell`'s `stdin` option](https://cspell.org/docs/getting-started/#options).

For example, providing `mistake`, `typo`, and `zzz` as words:

```shell
npx cspell --words mistake --words "typo zzz"
```

Providing `typo` alongside file globs:

```shell
npx cspell \"**/*\" --words typo
```

## Node.js API

A `populateWords` function is exported that you can use programmatically.
It takes in `globs` and/or `words` `string[]`s similar to the CLI:

```shell
npm i cspell-populate-words
```

```ts
import { populateWords } from "cspell-populate-words";

await populateWords({ globs: ["**/*"] });
await populateWords({ words: ["mistake", "typo zzz"] });
await populateWords({ globs: ["**/*"], words: ["mistake", "typo zzz"] });
```

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/cspell-populate-words/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/cspell-populate-words/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

<!-- You can remove this notice if you don't want it 🙂 no worries! -->

> 💙 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app).
