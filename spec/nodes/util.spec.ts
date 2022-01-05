/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import {
	generateNodes,
	makeTypeName,
	convertKindToCtorName,
	generateCodeFromNode,
	capitalizeFirstChar,
	writeDocComment,
} from '../../src/nodes/util'
import { Node } from '../../src/nodes/Node'
import { Kind } from 'haystack-core'

describe('generateNode()', function (): void {
	it('generates code from some nodes', function (): void {
		const node: Node = {
			generateCode(out: (code: string) => void): void {
				out('foo')
			},

			newLines: 1,
		}

		let str = ''

		generateNodes(
			(code: string) => {
				str += code + '\n'
			},
			[node, node, node]
		)

		expect(str).toBe('foo\n\nfoo\n\nfoo\n\n')
	})
}) // generateNode()

describe('generateCodeFromNode()', function (): void {
	it('generates the code from a node', function (): void {
		const node: Node = {
			generateCode(out: (code: string) => void): void {
				out('foo')
			},

			newLines: 1,
		}

		expect(generateCodeFromNode(node)).toBe('foo\n')
	})
}) // generateCodeFromNode()

describe('makeTypeName()', function (): void {
	it('throws an error for an empty string', function (): void {
		expect(() => makeTypeName('', {})).toThrow()
	})

	it('returns an interface name', function (): void {
		expect(makeTypeName('foo', {})).toBe('Foo')
	})

	it('returns an interface name for a Date', function (): void {
		expect(makeTypeName('date', {})).toBe('IDate')
	})

	it('returns an interface name for a Number', function (): void {
		expect(makeTypeName('number', {})).toBe('INumber')
	})

	it('returns an interface name for a Symbol', function (): void {
		expect(makeTypeName('symbol', {})).toBe('ISymbol')
	})

	it('returns an interface name for a conjunct', function (): void {
		expect(makeTypeName('elec-meter', {})).toBe('Elec_Meter')
	})

	it('returns an interface name for a feature', function (): void {
		expect(makeTypeName('lib:ph', {})).toBe('Ph')
	})

	it('returns an interface name for a feature that already has a cached name', function (): void {
		const cache: Record<string, string> = {}
		expect(makeTypeName('func', cache)).toBe('Func')
		expect(makeTypeName('func:func', cache)).toBe('Func_')
	})
}) // makeTypeName()

describe('capitalizeFirstChar()', function (): void {
	it('capitalizes the first character of a string', function (): void {
		expect(capitalizeFirstChar('foo')).toBe('Foo')
	})

	it('returns an empty string for an empty string', function (): void {
		expect(capitalizeFirstChar('')).toBe('')
	})

	it('capitalizes a single character string', function (): void {
		expect(capitalizeFirstChar('s')).toBe('S')
	})
}) // capitalizeFirstChar()

describe('convertKindToCtorName()', function (): void {
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
}) // convertKindToCtorName()

describe('writeDocComment()', function (): void {
	it('writes out a document comment', function (): void {
		let out = ''

		const comment = 'this is\na test\noh yes'

		writeDocComment((code: string): void => {
			out += code + '\n'
		}, comment)

		expect(out).toBe(' * this is\n * a test\n * oh yes\n')
	})
}) // writeDocComment()
