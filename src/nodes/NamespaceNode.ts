/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { InterfaceNode } from './InterfaceNode'
import { InterfaceValueNode } from './InterfaceValueNode'
import { Node } from './Node'
import { generateFromNodes } from './util'

/**
 * Generates a TypeScript namespace.
 */
export class NamespaceNode implements Node {
	public readonly name: string

	public readonly intNode: InterfaceNode

	public readonly newLines = 2

	public constructor(name: string, intNode: InterfaceNode) {
		this.name = name
		this.intNode = intNode
		this.intNode.newLines = 0
	}

	public generate(out: (code: string) => void): void {
		out(`export namespace ${this.name} {`)
		generateFromNodes((code: string): void => out(`  ${code}`), [
			this.intNode,
		])
		out('}')
	}

	public get values(): InterfaceValueNode[] {
		return this.intNode.values
	}
}
