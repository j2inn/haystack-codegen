<p align="center">
  <a href="https://github.com/j2inn/haystack-codegen/actions/workflows/master-push.yaml">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/j2inn/haystack-codegen/Master%20push" />
  </a>

  <a href="https://github.com/j2inn/haystack-codegen/blob/master/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/j2inn/haystack-codegen" />
	</a>
</p>

# Haystack Core Code Generation Tools

**This project is classed as experimental!**

Generates TypeScript code for [haystack-core](https://github.com/j2inn/haystack-codegen) using [haystack 4 defs](https://project-haystack.dev/doc/docHaystack/Defs).

* Generates TypeScript HDict [interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
* Generates TypeScript [type guard functions](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## Installation

```
npm install haystack-codegen
```

Or to install globally...

```
npm install haystack-codegen --global
```

Once installed, run the `defcodegen` command. Run `defcodegen --help` for all the different options.