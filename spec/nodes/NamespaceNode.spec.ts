/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { NamespaceNode } from '../../src/nodes/NamespaceNode'
import { InterfaceNode } from '../../src/nodes/InterfaceNode'
import { generateNode } from '../../src/nodes/util'

describe('NamespaceNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a namespace', function (): void {
			expect(
				generateNode(
					new NamespaceNode('Test', new InterfaceNode('node', 'Node'))
				)
			).toBe(
				'export namespace Test {\n  /**\n   * node\n   */\n  export interface Node extends HDict {\n  }\n}\n'
			)
		})
	}) // #generate()
})
