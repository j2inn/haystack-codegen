/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceValueNode } from './InterfaceValueNode'
import { Node } from './Node'
import { generateNodes, writeDocComment } from './util'

/**
 * Generates a TypeScript interface.
 */
export class InterfaceNode implements Node {
	public readonly def: string

	public readonly name: string

	public readonly doc: string

	public readonly extend: string[]

	public readonly values: InterfaceValueNode[]

	public newLines = 1

	public constructor({
		def,
		name,
		doc,
		extend,
		values,
	}: {
		def: string
		name: string
		doc?: string
		extend?: string[]
		values?: InterfaceValueNode[]
	}) {
		this.def = def
		this.name = name
		this.doc = doc ?? ''
		this.extend = extend ?? []
		this.values = values ?? []
	}

	public generateCode(out: (code: string) => void): void {
		out('/**')
		out(` * ${this.def}`)
		if (this.doc.trim()) {
			out(' *')
			writeDocComment(out, this.doc)
		}
		out(' */')

		if (this.values.length) {
			this.generateInterface(out)
		} else {
			this.generateType(out)
		}
	}

	public get types(): string[] {
		return this.values.map((valNode) => valNode.type)
	}

	private generateInterface(out: (code: string) => void): void {
		let code = `export interface ${this.name} extends ${
			this.extend.length ? this.extend[0] : 'HDict'
		}`

		for (let i = 1; i < this.extend.length; ++i) {
			code += `, ${this.extend[i]}`
		}

		code += ` {`
		out(code)

		// The last value shouldn't have any new lines after it.
		this.values.forEach(
			(val, i) => (val.newLines = i === this.values.length - 1 ? 0 : 1)
		)

		generateNodes(out, this.values)
		out('}')
	}

	private generateType(out: (code: string) => void): void {
		let code = `export type ${this.name} = ${
			this.extend.length ? this.extend[0] : 'HDict'
		}`

		for (let i = 1; i < this.extend.length; ++i) {
			code += ` & ${this.extend[i]}`
		}
		out(code)
	}
}
