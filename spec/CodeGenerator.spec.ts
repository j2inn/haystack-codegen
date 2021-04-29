/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { CodeGenerator } from '../src/CodeGenerator'
import { readFile } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { ZincReader, HNamespace, HGrid } from 'haystack-core'

const readFileAsync = promisify(readFile)

describe('CodeGenerator', function (): void {
	let namespace: HNamespace

	describe('#generate()', function (): void {
		beforeAll(async function (): Promise<void> {
			const defsBuf = await readFileAsync(
				path.join(__dirname, '../rc/defs.zinc')
			)
			const grid = ZincReader.readValue(
				defsBuf.toString('utf-8')
			) as HGrid

			namespace = new HNamespace(grid)
		})

		it('generates a document for a site', function (): void {
			console.log(
				new CodeGenerator(['filetype:json'], namespace).generate()
			)
		})
	})
})
