/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HaystackCoreImportNode } from './HaystackCoreImportNode'
import { Node } from './Node'
import { InterfaceNode } from './InterfaceNode'
import { generateNodes } from './util'
import { DocHeaderNode } from './DocHeaderNode'
import { NamespaceNode } from './NamespaceNode'
import { TypeGuardNode } from './TypeGuardNode'
import { LibsNode } from './LibsNode'

/**
 * Generates a TypeScript document.
 *
 * This is the root node for a document.
 */
export class DocNode implements Node {
	readonly newLines = 0

	readonly header = new DocHeaderNode()

	readonly import = new HaystackCoreImportNode()

	readonly libs = new LibsNode()

	readonly #nodes: Map<
		string,
		InterfaceNode | NamespaceNode | TypeGuardNode
	> = new Map()

	addInterface(intNode: InterfaceNode): void {
		this.#nodes.set(intNode.name, intNode)
	}

	addNamespace(nsNode: NamespaceNode): void {
		this.#nodes.set(`${nsNode.name}:${nsNode.intNode.name}`, nsNode)
	}

	addTypeGuard(tgNode: TypeGuardNode): void {
		this.#nodes.set(`tg-${tgNode.name}`, tgNode)
	}

	generateCode(out: (code: string) => void): void {
		this.addAllValuesToImport()
		generateNodes(out, [
			this.header,
			this.import,
			this.libs,
			...this.#nodes.values(),
		])
	}

	private addAllValuesToImport(): void {
		const nodes = this.#nodes
		const imp = this.import

		if (nodes.size) {
			imp.types.add('HDict')
		}

		for (const node of nodes.values()) {
			for (const type of node.types) {
				imp.types.add(type)
			}
		}
	}
}
