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
					new InterfaceValueNode({
						name: 'test',
						type: 'HBool',
						kind: Kind.Bool,
					})
				)
			).toBe('	test: HBool\n')
		})

		it('generates an optional boolean value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HBool',
						kind: Kind.Bool,
						optional: true,
					})
				)
			).toBe('	test?: HBool\n')
		})

		it('generates a coord value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HCoord',
						kind: Kind.Coord,
					})
				)
			).toBe('	test: HCoord\n')
		})

		it('generates a date value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HDate',
						kind: Kind.Date,
					})
				)
			).toBe('	test: HDate\n')
		})

		it('generates a date time value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HDateTime',
						kind: Kind.DateTime,
					})
				)
			).toBe('	test: HDateTime\n')
		})

		it('generates a dict value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HDict',
						kind: Kind.Dict,
					})
				)
			).toBe('	test: HDict\n')
		})

		it('generates a grid value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HGrid',
						kind: Kind.Grid,
					})
				)
			).toBe('	test: HGrid\n')
		})

		it('generates a list value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HList',
						kind: Kind.List,
					})
				)
			).toBe('	test: HList\n')
		})

		it('generates a list value node with a generic', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HList',
						kind: Kind.List,
						genericType: 'HSymbol',
						genericKind: Kind.Symbol,
					})
				)
			).toBe('	test: HList<HSymbol>\n')
		})

		it('generates a marker value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HMarker',
						kind: Kind.Marker,
					})
				)
			).toBe('	test: HMarker\n')
		})

		it('generates a NA value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HNa',
						kind: Kind.NA,
					})
				)
			).toBe('	test: HNa\n')
		})

		it('generates a number value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HNum',
						kind: Kind.Number,
					})
				)
			).toBe('	test: HNum\n')
		})

		it('generates a ref value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HRef',
						kind: Kind.Ref,
					})
				)
			).toBe('	test: HRef\n')
		})

		it('generates a remove value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HRemove',
						kind: Kind.Remove,
					})
				)
			).toBe('	test: HRemove\n')
		})

		it('generates a string value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HStr',
						kind: Kind.Str,
					})
				)
			).toBe('	test: HStr\n')
		})

		it('generates a symbol value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HSymbol',
						kind: Kind.Symbol,
					})
				)
			).toBe('	test: HSymbol\n')
		})

		it('generates a time value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HTime',
						kind: Kind.Time,
					})
				)
			).toBe('	test: HTime\n')
		})

		it('generates a xstr value node', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HXStr',
						kind: Kind.XStr,
					})
				)
			).toBe('	test: HXStr\n')
		})

		it('generates a value with a comment', function (): void {
			expect(
				generateCodeFromNode(
					new InterfaceValueNode({
						name: 'test',
						type: 'HStr',
						doc: 'doc comment',
						kind: Kind.Str,
					})
				)
			).toBe('	/**\n	 * doc comment\n	 */\n	test: HStr\n')
		})
	}) // #generate()
})
