/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceValueNode } from './InterfaceValueNode'
import { Node } from './Node'
import { generateFromNodes } from './util'

/**
 * Generates a TypeScript interface.
 */
export class InterfaceNode implements Node {
	public readonly def: string

	public readonly name: string

	public readonly extend: string[]

	public readonly values: InterfaceValueNode[]

	public newLines = 1

	public constructor(
		def: string,
		name: string,
		extend: string[] = [],
		values: InterfaceValueNode[] = []
	) {
		this.def = def
		this.name = name
		this.extend = extend
		this.values = values
	}

	public generate(out: (code: string) => void): void {
		out('/**')
		out(` * ${this.def}`)
		out(' */')

		let code = `export interface ${this.name} extends ${
			this.extend.length ? this.extend[0] : 'HDict'
		}`

		for (let i = 1; i < this.extend.length; ++i) {
			code += `, ${this.extend[i]}`
		}

		code += ' {'
		out(code)
		generateFromNodes(out, this.values)
		out('}')
	}

	public get types(): string[] {
		return this.values.map((valNode) => valNode.type)
	}
}
