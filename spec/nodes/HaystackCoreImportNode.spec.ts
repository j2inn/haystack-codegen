/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HaystackCoreImportNode } from '../../src/nodes/HaystackCoreImportNode'
import { generateNode } from '../../src/nodes/util'

describe('HaystackCoreImportNode', function (): void {
	describe('#generate()', function (): void {
		it('generates nothing if there are no types', function (): void {
			expect(generateNode(new HaystackCoreImportNode())).toBe('')
		})

		it('generates an import statement for a type', function (): void {
			expect(generateNode(new HaystackCoreImportNode(['HStr']))).toBe(
				"import { HStr } from 'haystack-core'\n"
			)
		})

		it('generates an import statement from multiple types', function (): void {
			expect(
				generateNode(new HaystackCoreImportNode(['HStr', 'HDate']))
			).toBe("import { HStr, HDate } from 'haystack-core'\n")
		})
	}) // #generate()
})
