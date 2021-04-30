/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { TypeGuardNode } from '../../src/nodes/TypeGuardNode'
import { generateNode } from '../../src/nodes/util'

describe('TypeGuardNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a type guard with a single tag check', function (): void {
			expect(
				generateNode(new TypeGuardNode('site', 'Site', [])).trim()
			).toBe(
				`
/**
 * Returns true if a value is a site
 *
 * An optional namespace can be passed in that will perform the check using defs
 *
 * @param value The value to test
 * @param namespace An optional namespace
 * @returns true if the value matches
 */
export function isSite(value: unknown, namespace?: HNamespace): value is Site {
	if (!valueIsKind<HDict>(value, Kind.Dict)) {
		return false
	}

	if (namespace) {
		return !!namespace.reflect(value)?.fits('site')
	} else {
		return (
			value.has('site')
		)
	}
}`.trim()
			)
		})

		it('generates a type guard with multiple tag checks', function (): void {
			expect(
				generateNode(
					new TypeGuardNode('site', 'Site', ['foo', 'boo', 'goo'])
				).trim()
			).toBe(
				`
/**
 * Returns true if a value is a site
 *
 * An optional namespace can be passed in that will perform the check using defs
 *
 * @param value The value to test
 * @param namespace An optional namespace
 * @returns true if the value matches
 */
export function isSite(value: unknown, namespace?: HNamespace): value is Site {
	if (!valueIsKind<HDict>(value, Kind.Dict)) {
		return false
	}

	if (namespace) {
		return !!namespace.reflect(value)?.fits('site')
	} else {
		return (
			value.has('site') ||
			value.has('foo') ||
			value.has('boo') ||
			value.has('goo')
		)
	}
}`.trim()
			)
		})
	}) // #generate()
})
