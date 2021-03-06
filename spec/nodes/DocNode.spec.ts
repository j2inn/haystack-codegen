/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { DocNode } from '../../src/nodes/DocNode'
import { InterfaceValueNode } from '../../src/nodes/InterfaceValueNode'
import { InterfaceNode } from '../../src/nodes/InterfaceNode'
import { Kind } from 'haystack-core'
import { generateCodeFromNode } from '../../src/nodes/util'
import { DocHeaderNode } from '../../src/nodes/DocHeaderNode'

describe('DocNode', function (): void {
	beforeAll(function (): void {
		jest.spyOn(DocHeaderNode.prototype, 'toDateString').mockImplementation(
			() => 'date'
		)
	})

	describe('#generate()', function (): void {
		it('generates a document with one interface', function (): void {
			const doc = new DocNode()

			doc.addInterface(
				new InterfaceNode({
					def: 'foo',
					name: 'Foo',
					values: [
						new InterfaceValueNode({
							name: 'test',
							type: 'HStr',
							kind: Kind.Str,
						}),
					],
				})
			)

			expect(generateCodeFromNode(doc).trim()).toEqual(
				`
/*
 * Automatically generated by haystack-codegen on date.
 */

/* eslint @typescript-eslint/no-namespace: "off" */

import {
	HDict,
	HStr,
} from 'haystack-core'

/**
 * Libraries used for code generation.
 */
export const LIBS = []

/**
 * foo
 */
export interface Foo extends HDict {
	test: HStr
}`.trim()
			)
		})

		it('generates a document with two interfaces', function (): void {
			const doc = new DocNode()

			doc.addInterface(
				new InterfaceNode({
					def: 'boo',
					name: 'Boo',
					values: [
						new InterfaceValueNode({
							name: 'test',
							type: 'HStr',
							kind: Kind.Str,
						}),
					],
				})
			)

			doc.addInterface(
				new InterfaceNode({
					def: 'foo',
					name: 'Foo',
					extend: ['Boo'],
					values: [
						new InterfaceValueNode({
							name: 'test',
							type: 'HStr',
							kind: Kind.Str,
						}),
					],
				})
			)

			expect(generateCodeFromNode(doc).trim()).toBe(
				`
/*
 * Automatically generated by haystack-codegen on date.
 */

/* eslint @typescript-eslint/no-namespace: "off" */

import {
	HDict,
	HStr,
} from 'haystack-core'

/**
 * Libraries used for code generation.
 */
export const LIBS = []

/**
 * boo
 */
export interface Boo extends HDict {
	test: HStr
}

/**
 * foo
 */
export interface Foo extends Boo {
	test: HStr
}`.trim()
			)
		})
	})
})
