/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { NamespaceNode } from '../../src/nodes/NamespaceNode'
import { InterfaceNode } from '../../src/nodes/InterfaceNode'
import { generateCodeFromNode } from '../../src/nodes/util'

describe('NamespaceNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a namespace', function (): void {
			expect(
				generateCodeFromNode(
					new NamespaceNode(
						'Test',
						new InterfaceNode({ def: 'node', name: 'Node' }),
						''
					)
				).trim()
			).toBe(
				`
/**
 * Test
 */
export namespace Test {
	/**
	 * node
	 */
	export interface Node extends HDict {}
}
`.trim()
			)
		})
	}) // #generate()
})
