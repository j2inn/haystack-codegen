/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceValueNode } from '../../src/nodes/InterfaceValueNode'
import { Kind } from 'haystack-core'
import { generateCodeFromNode } from '../../src/nodes/util'

describe('InterfaceValueNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a boolean value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Bool })
				)
			).toBe('	test: HBool\n')
		})

		it('generates an optional boolean value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						kind: Kind.Bool,
						optional: true,
					})
				)
			).toBe('	test?: HBool\n')
		})

		it('generates a coord value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Coord })
				)
			).toBe('	test: HCoord\n')
		})

		it('generates a date value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Date })
				)
			).toBe('	test: HDate\n')
		})

		it('generates a date time value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						kind: Kind.DateTime,
					})
				)
			).toBe('	test: HDateTime\n')
		})

		it('generates a dict value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Dict })
				)
			).toBe('	test: HDict\n')
		})

		it('generates a grid value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Grid })
				)
			).toBe('	test: HGrid\n')
		})

		it('generates a list value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.List })
				)
			).toBe('	test: HList\n')
		})

		it('generates a list value node with a generic', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						generic: 'Symbol',
						kind: Kind.List,
					})
				)
			).toBe('	test: HList<Symbol>\n')
		})

		it('generates a marker value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Marker })
				)
			).toBe('	test: HMarker\n')
		})

		it('generates a NA value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.NA })
				)
			).toBe('	test: HNa\n')
		})

		it('generates a number value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Number })
				)
			).toBe('	test: HNum\n')
		})

		it('generates a ref value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Ref })
				)
			).toBe('	test: HRef\n')
		})

		it('generates a remove value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Remove })
				)
			).toBe('	test: HRemove\n')
		})

		it('generates a string value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Str })
				)
			).toBe('	test: HStr\n')
		})

		it('generates a symbol value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Symbol })
				)
			).toBe('	test: HSymbol\n')
		})

		it('generates a time value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.Time })
				)
			).toBe('	test: HTime\n')
		})

		it('generates a xstr value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({ name: 'test', kind: Kind.XStr })
				)
			).toBe('	test: HXStr\n')
		})

		it('generates a value with a comment', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						doc: 'doc comment',
						kind: Kind.Str,
					})
				)
			).toBe('	/**\n	 * doc comment\n	 */\n	test: HStr\n')
		})
	}) // #generate()
})
