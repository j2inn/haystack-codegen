/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Node } from './Node'
import { makeFirstCharUpperCase } from '../nodes/util'

/**
 * Generates a type guard for a type.
 */
export class TypeGuardNode implements Node {
	public readonly def: string

	public readonly name: string

	public readonly has: string[]

	public readonly newLines = 1

	public readonly types = ['HNamespace', 'valueIsKind', 'Kind', 'HDict']

	public constructor(def: string, name: string, has: string[]) {
		this.def = def
		this.name = name
		this.has = has
	}

	public generate(out: (code: string) => void): void {
		out('/**')
		out(` * Returns true if a value is a ${this.def}`)
		out(' *')
		out(
			' * An optional namespace can be passed in that will perform the check using defs'
		)
		out(' *')
		out(' * @param value The value to test')
		out(' * @param namespace An optional namespace')
		out(' * @returns true if the value matches')
		out(' */')
		out(
			`export function is${makeFirstCharUpperCase(
				this.def
			)}(value: unknown, namespace?: HNamespace): value is ${this.name} {`
		)
		out('	if (!valueIsKind<HDict>(value, Kind.Dict)) {')
		out('		return false')
		out('	}')
		out('')
		out('	if (namespace) {')
		out(`		return !!namespace.reflect(value)?.fits('${this.def}')`)
		out('	} else {')
		out('		return (')
		const types = [this.def, ...this.has]
		types.forEach((type, i) =>
			out(`			value.has('${type}')${i === types.length - 1 ? '' : ' ||'}`)
		)
		out('		)')
		out('	}')
		out('}')
	}
}
