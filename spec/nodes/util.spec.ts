/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import {
	generateFromNodes,
	makeTypeName,
	convertKindToCtorName,
} from '../../src/nodes/util'
import { Node } from '../../src/nodes/Node'
import { Kind } from 'haystack-core'

describe('generateFromNodes()', function (): void {
	it('generates code from some nodes', function (): void {
		const node: Node = {
			generate(out: (code: string) => void): void {
				out('foo')
			},

			newLines: 1,
		}

		let str = ''

		generateFromNodes(
			(code: string) => {
				str += code + '\n'
			},
			[node, node, node]
		)

		expect(str).toBe('foo\n\nfoo\n\nfoo\n\n')
	})
}) // generateFromNodes()

describe('makeTypeName()', function (): void {
	it('throws an error for an empty string', function (): void {
		expect(() => makeTypeName('')).toThrow()
	})

	it('returns an interface name', function (): void {
		expect(makeTypeName('foo')).toBe('Foo')
	})

	it('returns an interface name for a Date', function (): void {
		expect(makeTypeName('date')).toBe('IDate')
	})

	it('returns an interface name for a conjunct', function (): void {
		expect(makeTypeName('elec-meter')).toBe('Elec_Meter')
	})
}) // makeTypeName()

describe('convertKindToCtorName', function (): void {
	it('generates a boolean value node', function (): void {
		expect(convertKindToCtorName(Kind.Bool)).toBe('HBool')
	})

	it('generates a coord value node', function (): void {
		expect(convertKindToCtorName(Kind.Coord)).toBe('HCoord')
	})

	it('generates a date value node', function (): void {
		expect(convertKindToCtorName(Kind.Date)).toBe('HDate')
	})

	it('generates a date time value node', function (): void {
		expect(convertKindToCtorName(Kind.DateTime)).toBe('HDateTime')
	})

	it('generates a dict value node', function (): void {
		expect(convertKindToCtorName(Kind.Dict)).toBe('HDict')
	})

	it('generates a grid value node', function (): void {
		expect(convertKindToCtorName(Kind.Grid)).toBe('HGrid')
	})

	it('generates a list value node', function (): void {
		expect(convertKindToCtorName(Kind.List)).toBe('HList')
	})

	it('generates a marker value node', function (): void {
		expect(convertKindToCtorName(Kind.Marker)).toBe('HMarker')
	})

	it('generates a NA value node', function (): void {
		expect(convertKindToCtorName(Kind.NA)).toBe('HNa')
	})

	it('generates a number value node', function (): void {
		expect(convertKindToCtorName(Kind.Number)).toBe('HNum')
	})

	it('generates a ref value node', function (): void {
		expect(convertKindToCtorName(Kind.Ref)).toBe('HRef')
	})

	it('generates a remove value node', function (): void {
		expect(convertKindToCtorName(Kind.Remove)).toBe('HRemove')
	})

	it('generates a string value node', function (): void {
		expect(convertKindToCtorName(Kind.Str)).toBe('HStr')
	})

	it('generates a symbol value node', function (): void {
		expect(convertKindToCtorName(Kind.Symbol)).toBe('HSymbol')
	})

	it('generates a time value node', function (): void {
		expect(convertKindToCtorName(Kind.Time)).toBe('HTime')
	})

	it('generates a xstr value node', function (): void {
		expect(convertKindToCtorName(Kind.XStr)).toBe('HXStr')
	})
})
