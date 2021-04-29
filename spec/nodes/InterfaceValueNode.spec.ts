/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceValueNode } from '../../src/nodes/InterfaceValueNode'
import { Kind } from 'haystack-core'
import { generateNode } from '../../src/nodes/util'

describe('InterfaceValueNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a boolean value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Bool))
			).toBe('	test: HBool\n')
		})

		it('generates an optional boolean value node', function (): void {
			expect(
				generateNode(
					new InterfaceValueNode('test', Kind.Bool, /*optional*/ true)
				)
			).toBe('	test?: HBool\n')
		})

		it('generates a coord value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Coord))
			).toBe('	test: HCoord\n')
		})

		it('generates a date value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Date))
			).toBe('	test: HDate\n')
		})

		it('generates a date time value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.DateTime))
			).toBe('	test: HDateTime\n')
		})

		it('generates a dict value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Dict))
			).toBe('	test: HDict\n')
		})

		it('generates a grid value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Grid))
			).toBe('	test: HGrid\n')
		})

		it('generates a list value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.List))
			).toBe('	test: HList\n')
		})

		it('generates a marker value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Marker))
			).toBe('	test: HMarker\n')
		})

		it('generates a NA value node', function (): void {
			expect(generateNode(new InterfaceValueNode('test', Kind.NA))).toBe(
				'	test: HNa\n'
			)
		})

		it('generates a number value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Number))
			).toBe('	test: HNum\n')
		})

		it('generates a ref value node', function (): void {
			expect(generateNode(new InterfaceValueNode('test', Kind.Ref))).toBe(
				'	test: HRef\n'
			)
		})

		it('generates a remove value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Remove))
			).toBe('	test: HRemove\n')
		})

		it('generates a string value node', function (): void {
			expect(generateNode(new InterfaceValueNode('test', Kind.Str))).toBe(
				'	test: HStr\n'
			)
		})

		it('generates a symbol value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Symbol))
			).toBe('	test: HSymbol\n')
		})

		it('generates a time value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.Time))
			).toBe('	test: HTime\n')
		})

		it('generates a xstr value node', function (): void {
			expect(
				generateNode(new InterfaceValueNode('test', Kind.XStr))
			).toBe('	test: HXStr\n')
		})
	}) // #generate()
})
