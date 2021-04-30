/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HNamespace, HStr } from 'haystack-core'
import { DocNode } from './nodes/DocNode'
import { InterfaceNode } from './nodes/InterfaceNode'
import { InterfaceValueNode } from './nodes/InterfaceValueNode'
import { NamespaceNode } from './nodes/NamespaceNode'
import { TypeGuardNode } from './nodes/TypeGuardNode'
import { generateNode, makeTypeName } from './nodes/util'

/**
 * Generate code for a TypeScript document.
 */
export class CodeGenerator {
	readonly #names: string[]

	readonly #namespace: HNamespace

	public constructor(names: string[], namespace: HNamespace) {
		this.#names = names
		this.#namespace = namespace
	}

	public generate(): string {
		const doc = new DocNode()

		for (const name of this.removeDuplicates(this.#names)) {
			if (!this.#namespace.has(name)) {
				throw new Error(`Could not find def for ${name}`)
			}

			this.addInterfaceNode(doc, name)
		}

		return generateNode(doc)
	}

	private addInterfaceNode(doc: DocNode, name: string): void {
		const tags = this.#namespace.tags(name)

		const def = this.#namespace.byName(name)

		const intNode = new InterfaceNode({
			def: name,
			name: makeTypeName(name),
			doc: def?.get<HStr>('doc')?.value ?? '',
		})

		// Add everything this def extends from.
		for (const sup of this.#namespace.superTypesOf(name)) {
			intNode.extend.push(makeTypeName(sup.defName))
			this.addInterfaceNode(doc, sup.defName)
		}

		// Add all tags that relate to this def.
		for (const tag of tags) {
			for (const tagOn of this.#namespace.tagOn(tag.defName)) {
				if (tagOn.defName === name) {
					const kind = this.#namespace.defToKind(tag.defName)

					const optional = !tag.has('mandatory')

					if (kind) {
						intNode.values.push(
							new InterfaceValueNode(tag.defName, kind, optional)
						)
					}
				}
			}
		}

		if (HNamespace.isFeature(name)) {
			doc.addNamespace(
				new NamespaceNode(name.split(':')[0] ?? '', intNode)
			)
		} else {
			doc.addInterface(intNode)

			if (
				this.#namespace.fitsEntity(name) &&
				name !== 'entity' &&
				!HNamespace.isConjunct(name)
			) {
				doc.addTypeGuard(
					new TypeGuardNode(
						name,
						makeTypeName(name),
						this.#namespace
							.allSubTypesOf(name)
							.map((def) => def.defName)
					)
				)
			}
		}
	}

	private removeDuplicates(names: string[]): string[] {
		const set = new Set<string>()
		names.forEach(set.add, set)
		return [...names]
	}
}
