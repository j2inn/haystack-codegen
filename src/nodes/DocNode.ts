/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HaystackCoreImportNode } from './HaystackCoreImportNode'
import { Node } from './Node'
import { InterfaceNode } from './InterfaceNode'
import { generateFromNodes } from './util'
import { DocCommentNode } from './DocCommentNode'
import { NamespaceNode } from './NamespaceNode'

/**
 * Generates a TypeScript document.
 *
 * This is the root node for a document.
 */
export class DocNode implements Node {
	readonly newLines = 0

	readonly comment = new DocCommentNode()

	readonly import = new HaystackCoreImportNode()

	readonly #nodes: Map<string, InterfaceNode | NamespaceNode> = new Map()

	public addInterface(intNode: InterfaceNode): void {
		this.#nodes.set(intNode.name, intNode)
	}

	public addNamespace(nsNode: NamespaceNode): void {
		this.#nodes.set(`${nsNode.name}:${nsNode.intNode.name}`, nsNode)
	}

	public generate(out: (code: string) => void): void {
		this.addAllValuesToImport()
		generateFromNodes(out, [
			this.comment,
			this.import,
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
			for (const valueNode of node.values) {
				imp.types.add(valueNode.hvalCtorName)
			}
		}
	}
}
