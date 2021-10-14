/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HaystackCoreImportNode } from './HaystackCoreImportNode'
import { Node } from './Node'
import { InterfaceNode } from './InterfaceNode'
import { generateNodes } from './util'
import { DocCommentNode } from './DocCommentNode'
import { NamespaceNode } from './NamespaceNode'
import { TypeGuardNode } from './TypeGuardNode'
import { LibsNode } from './LibsNode'

/**
 * Generates a TypeScript document.
 *
 * This is the root node for a document.
 */
export class DocNode implements Node {
	public readonly newLines = 0

	public readonly comment = new DocCommentNode()

	public readonly import = new HaystackCoreImportNode()

	public readonly libs = new LibsNode()

	readonly #nodes: Map<
		string,
		InterfaceNode | NamespaceNode | TypeGuardNode
	> = new Map()

	public addInterface(intNode: InterfaceNode): void {
		this.#nodes.set(intNode.name, intNode)
	}

	public addNamespace(nsNode: NamespaceNode): void {
		this.#nodes.set(`${nsNode.name}:${nsNode.intNode.name}`, nsNode)
	}

	public addTypeGuard(tgNode: TypeGuardNode): void {
		this.#nodes.set(`tg-${tgNode.name}`, tgNode)
	}

	public generateCode(out: (code: string) => void): void {
		this.addAllValuesToImport()
		generateNodes(out, [
			this.comment,
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
