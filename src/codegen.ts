/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import colors from 'colors/safe'
import { CodeGenerator } from './CodeGenerator'
import { resolveDefaultNamespace, resolvePodsNamespace } from './namespace'
import { Command } from 'commander'
import path from 'path'
import { promisify } from 'util'
import { writeFile, mkdir } from 'fs'
import { HNamespace } from 'haystack-core'
import { Client } from 'haystack-nclient'
import fetch from 'node-fetch'

const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)

function log(message: string): void {
	console.log(message)
}

export async function codegen(): Promise<void> {
	const program = new Command()

	const { defs, file, uri } = program
		.description(
			colors.green(
				`
Generate TypeScript code from haystack v4 defs

Defs are fetched in the following order...

- If a uri is specified, a network request will be made to fetch the defs.
- If FIN_HOME or FAN_HOME is specified, the defs will be compiled from POD files.
- As a last resort, the defs used in this library will be used.
`.trim()
			)
		)
		.option(
			'-d, --defs <defs...>',
			'a space separated list of defs to generate code from'
		)
		.option(
			'-f, --file <file>',
			'the TypeScript file to generate',
			'./src/haystack/types.ts'
		)
		.option(
			'-u, --uri <uri>',
			'haystack server uri (i.e. http://localhost:8080/api/projectNameGoesHere)'
		)
		.parse(process.argv)
		.opts()

	if (process.argv.length < 3 || !defs || !defs.length) {
		program.help()
		return
	}

	log(
		colors.green('Creating TypeScript for ') +
			colors.yellow(defs.join(', '))
	)

	let namespace: HNamespace | undefined

	if (uri) {
		log(colors.green('  Found uri: ') + colors.yellow(uri))
		log(colors.green('  Requesting defs from server...'))

		try {
			const client = new Client({
				base: new URL(uri),
				fetch: fetch as any,
			})
			await client.ext.loadDefs()
			namespace = client.defs
			log(colors.green('  Successfully requested defs'))
		} catch (err) {
			log(
				colors.red(
					'  Cannot load defs from uri. Ensure the server is active and does not have authentication enabled'
				)
			)
			throw err
		}
	} else if (process.env.FIN_HOME) {
		const home = String(process.env.FIN_HOME)
		log(
			colors.green('  Found FIN_HOME environment variable: ') +
				colors.yellow(home)
		)
		log(colors.green('    Compiling defs...'))
		namespace = await resolvePodsNamespace(`${home}/lib/pod`)
	} else if (process.env.FAN_HOME) {
		const home = String(process.env.FAN_HOME)
		log(
			colors.green('  Found FAN_HOME environment variable: ') +
				colors.yellow(home)
		)
		log(colors.green('    Compiling defs...'))
		namespace = await resolvePodsNamespace(`${home}/lib/fan`, 'ph')
	}

	if (!namespace) {
		log(colors.green('  Reading default namespace'))
		namespace = await resolveDefaultNamespace()
	}

	log(colors.green('  Generating TypeScript...'))
	const ts = new CodeGenerator(defs, namespace).generate()

	log(colors.green('  Writing file ') + colors.yellow(file))
	const tsFile = path.resolve(file)
	await mkdirAsync(path.dirname(tsFile), { recursive: true })
	await writeFileAsync(tsFile, ts)

	log(colors.green('  Successfully created TypeScript file!'))
}
