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

const writeFileAsync = promisify(writeFile)
const mkdirAsync = promisify(mkdir)

function log(message: string): void {
	console.log(message)
}

export async function codegen(): Promise<void> {
	const program = new Command()

	const { defs, file } = program
		.description('Generate TypeScript code from haystack v4 defs')
		.option(
			'-d, --defs <defs...>',
			'a space separated list of defs to generate code from'
		)
		.option(
			'-f, --file <file>',
			'the TypeScript file to generate',
			'./src/haystack/types.ts'
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

	if (process.env.FAN_HOME) {
		const fanHome = String(process.env.FAN_HOME)
		log(
			colors.green('  Found FAN_HOME environment variable: ') +
				colors.yellow(fanHome)
		)
		log(colors.green('    Compiling defs...'))
		namespace = await resolvePodsNamespace(`${fanHome}/lib/fan`)
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
