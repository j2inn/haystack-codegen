/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceValueNode } from '../../src/nodes/InterfaceValueNode'
import { InterfaceNode } from '../../src/nodes/InterfaceNode'
import { Kind } from 'haystack-core'
import { generateNode } from '../../src/nodes/util'

describe('InterfaceNode', function (): void {
	describe('#generate()', function (): void {
		it('generates an interface', function (): void {
			const node = new InterfaceNode({
				def: 'test',
				name: 'Test',
				values: [new InterfaceValueNode('test', Kind.Bool)],
			})

			expect(generateNode(node)).toBe(
				'/**\n * test\n */\nexport interface Test extends HDict {\n	test: HBool\n}\n'
			)
		})

		it('generates an interface that extends an interface', function (): void {
			const node = new InterfaceNode({
				def: 'dog',
				name: 'Dog',
				extend: ['Mammal'],
				values: [new InterfaceValueNode('test', Kind.Bool)],
			})

			expect(generateNode(node)).toBe(
				'/**\n * dog\n */\nexport interface Dog extends Mammal {\n	test: HBool\n}\n'
			)
		})

		it('generates an interface that extends multiple interfaces', function (): void {
			const node = new InterfaceNode({
				def: 'dog',
				name: 'Dog',
				extend: ['Mammal', 'Pug'],
				values: [new InterfaceValueNode('test', Kind.Bool)],
			})

			expect(generateNode(node)).toBe(
				'/**\n * dog\n */\nexport interface Dog extends Mammal, Pug {\n	test: HBool\n}\n'
			)
		})
	}) // #generate()
})
