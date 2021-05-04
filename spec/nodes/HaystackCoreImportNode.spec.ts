/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HaystackCoreImportNode } from '../../src/nodes/HaystackCoreImportNode'
import { generateCodeFromNode } from '../../src/nodes/util'

describe('HaystackCoreImportNode', function (): void {
	describe('#generate()', function (): void {
		it('generates nothing if there are no types', function (): void {
			expect(generateCodeFromNode(new HaystackCoreImportNode())).toBe('')
		})

		it('generates an import statement for a type', function (): void {
			expect(
				generateCodeFromNode(new HaystackCoreImportNode(['HStr']))
			).toBe("import {\n	HStr\n} from 'haystack-core'\n")
		})

		it('generates an import statement from multiple types', function (): void {
			expect(
				generateCodeFromNode(
					new HaystackCoreImportNode(['HStr', 'HDate'])
				)
			).toBe("import {\n	HStr,\n	HDate,\n} from 'haystack-core'\n")
		})
	}) // #generate()
})
