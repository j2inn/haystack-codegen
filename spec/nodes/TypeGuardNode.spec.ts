/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { TypeGuardNode } from '../../src/nodes/TypeGuardNode'
import { generateCodeFromNode } from '../../src/nodes/util'

describe('TypeGuardNode', function (): void {
	describe('#generate()', function (): void {
		it('generates a type guard with a single tag check', function (): void {
			expect(
				generateCodeFromNode(new TypeGuardNode('site', 'Site')).trim()
			).toBe(
				`
/**
 * Returns true if the value is a site.
 *
 * @param value The value to test.
 * @param namespace The namespace to validate against.
 * @returns true if the value matches.
 */
export function isSite(value: unknown, namespace: HNamespace): value is Site {
	return namespace.isValid('site', value)
}`.trim()
			)
		})
	}) // #generate()
})
