/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Node } from './Node'
import { capitalizeFirstChar } from '../nodes/util'

/**
 * Generates a type guard for a type.
 */
export class TypeGuardNode implements Node {
	readonly def: string

	readonly name: string

	readonly newLines = 1

	readonly types = ['HNamespace']

	constructor(def: string, name: string) {
		this.def = def
		this.name = name
	}

	generateCode(out: (code: string) => void): void {
		out('/**')
		out(` * Returns true if the value is a ${this.def}.`)
		out(' *')
		out(' * @param value The value to test.')
		out(' * @param namespace The namespace to validate against.')
		out(' * @returns true if the value matches.')
		out(' */')
		out(
			`export function is${capitalizeFirstChar(
				this.def
			)}(value: unknown, namespace: HNamespace): value is ${this.name} {`
		)
		out(`	return namespace.isValid('${this.def}', value)`)
		out('}')
	}
}
