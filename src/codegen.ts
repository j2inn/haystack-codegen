/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import colors from 'colors/safe'
import { readFile } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { ZincReader, HNamespace, HGrid, HDict } from 'haystack-core'
import { CodeGenerator } from './CodeGenerator'

const readFileAsync = promisify(readFile)

function log(message: string): void {
	console.log(message)
}

async function resolveNamespace(): Promise<HNamespace> {
	const defsBuf = await readFileAsync(path.join(__dirname, '../rc/defs.zinc'))
	const grid = ZincReader.readValue(defsBuf.toString('utf-8')) as HGrid
	return new HNamespace(grid)
}

export async function codegen(names: string[]): Promise<void> {
	log(
		colors.green('Creating TypeScript from defs for ') +
			colors.yellow(names.join(', '))
	)

	log(colors.green('  Reading defs...'))
	const namespace = await resolveNamespace()

	log(colors.green('  Generating TypeScript...'))
	console.log(new CodeGenerator(names, namespace).generate())
}
