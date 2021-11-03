/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HDict, HSymbol } from 'haystack-core'
import { LibsNode } from '../../src/nodes/LibsNode'
import { generateCodeFromNode } from '../../src/nodes/util'

describe('LibsNode', function (): void {
	describe('#generate()', function (): void {
		it('generates libs', function (): void {
			const node = new LibsNode()

			node.addLib(
				new HDict({
					def: HSymbol.make('lib:foo'),
					version: '1.0.0',
				})
			)

			const bar = new HDict({
				def: HSymbol.make('lib:bar'),
				version: '2.0.0',
			})

			node.addLib(bar)
			node.addLib(bar)

			expect(generateCodeFromNode(node)).toBe(
				`/**
 * Libraries used for code generation.
 */
export const LIBS = [
	{
		name: 'lib:foo',
		version: '1.0.0',
	},
	{
		name: 'lib:bar',
		version: '2.0.0',
	},
]
`
			)
		}) // generates libs

		it('generates an empty libs array', function (): void {
			const node = new LibsNode()

			expect(generateCodeFromNode(node)).toBe(
				`/**
 * Libraries used for code generation.
 */
export const LIBS = []
`
			)
		}) // generates an empty libs array
	}) // #generate()
})
