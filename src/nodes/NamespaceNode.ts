/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceNode } from './InterfaceNode'
import { InterfaceValueNode } from './InterfaceValueNode'
import { Node } from './Node'
import { generateNodes, writeDocComment } from './util'

/**
 * Generates a TypeScript namespace.
 */
export class NamespaceNode implements Node {
	readonly name: string

	readonly intNode: InterfaceNode

	readonly doc: string

	readonly newLines = 2

	constructor(name: string, intNode: InterfaceNode, doc: string) {
		this.name = name
		this.intNode = intNode
		this.doc = doc
		this.intNode.newLines = 0
	}

	generateCode(out: (code: string) => void): void {
		out('/**')
		out(` * ${this.name}`)
		if (this.doc.trim()) {
			out(' *')
			writeDocComment(out, this.doc)
		}
		out(' */')
		out(`export namespace ${this.name} {`)
		generateNodes((code: string): void => out(`	${code}`), [this.intNode])
		out('}')
	}

	get values(): InterfaceValueNode[] {
		return this.intNode.values
	}

	get types(): string[] {
		return this.intNode.types
	}
}
