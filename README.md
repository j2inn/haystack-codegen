<p align="center">
  <a href="https://github.com/j2inn/haystack-react/actions/workflows/master-push-pull-request.yaml">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/j2inn/haystack-react/master-push-pull-request.yaml" />
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

## APIs

Please click [here](https://tu1lu98z65.execute-api.us-east-1.amazonaws.com/default/j2docs/j2inn/haystack-codegen/index.html) for the API documentation.

## Def docs

Please click [here](https://tu1lu98z65.execute-api.us-east-1.amazonaws.com/default/j2docs/j2inn/haystack-codegen/modules/haystack_types.html) for the generated typedoc information for all defs.

## Installation

```
npm install haystack-codegen
```

Or to install globally...

```
npm install haystack-codegen --global
```

## Use

Use the `-t` option to specify a space separated list of tags. For example, to create all the TypeScript code for a `site` and `ahu` tag...

```
defcodegen -t site ahu
```

If you want to generate TypeScript for *all* of the tags in a defs database run...

```
defcodegen -t *all*
```

*Tip: try running `typedoc` on the generated code for some nice looking HTML documentation!*

### Generating a file

The tool runs relative to the directory it is run in. The default generated file path is `./src/haystack/types.ts`. An alternative file can be specified via the `-f` option...

```
defcodegen -t site ahu -f ./src/foo/bar.ts
```

### Specifying the defs

The tool uses defs to generate TypeScript code. The defs database can be specified in a number of ways. By default...

* The tool looks for the `FIN_HOME` environment variable. If found, the defs will be compiled from the `$FIN_HOME/lib/pod` directory.
* The tool looks for the `FAN_HOME` environment variable. If found, the defs will be compiled from the `$FAN_HOME/lib.fan` directory. In this scenario only POD files that start with `ph` will be used.
* As a last resort, the tool will fallback to the def library embedded into `haystack-codegen`. Please note, this library could easily become out of date quickly.

#### Loading defs from a server

Due to the dynamic nature of defs, the most commonly used way is to load defs from a running server.

Ensure server authentication is disabled when doing this (for FIN/SkySpark use the `-noAuth` option on start up).

For instance, to generate the TypeScript code for the `site` tag from a server's demo project... 

```
defcodegen -t site -u http://localhost:8080/api/demo
```

### Help

For more information on command line options run `defcodegen --help`.