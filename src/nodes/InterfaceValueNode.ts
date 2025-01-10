/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Kind } from 'haystack-core'
import { Node } from './Node'
import { convertKindToCtorName, writeDocComment } from './util'

/**
 * Generates a value line in a TypeScript interface.
 */
export class InterfaceValueNode implements Node {
	readonly name: string

	readonly doc: string

	readonly type: string

	readonly kind: Kind

	readonly genericType?: string

	readonly genericKind?: Kind

	readonly optional: boolean

	/**
	 * The number of new lines after this node is set dynamically depending on its
	 * position in the parent interface.
	 */
	newLines = 1

	constructor({
		name,
		type,
		kind,
		doc,
		genericType,
		genericKind,
		optional,
	}: {
		name: string
		type: string
		kind: Kind
		doc?: string
		genericType?: string
		genericKind?: Kind
		optional?: boolean
	}) {
		this.name = name
		this.type = type
		this.kind = kind
		this.doc = doc ?? ''
		this.genericType = genericType
		this.genericKind = genericKind
		this.optional = !!optional
	}

	generateCode(out: (code: string) => void): void {
		if (this.doc.trim()) {
			out('	/**')
			writeDocComment((code: string): void => out(`	${code}`), this.doc)
			out('	 */')
		}

		out(
			`	${this.name}${this.optional ? '?' : ''}: ${this.type}${
				this.genericType ? `<${this.genericType}>` : ''
			}`
		)
	}

	/**
	 * Returns the types (haystack-core constructor names) used with this node.
	 *
	 * @param kind The kind.
	 * @returns The TypeScript haystack constructor names.
	 */
	get types(): string[] {
		const types = [convertKindToCtorName(this.kind)]

		if (this.genericKind) {
			types.push(convertKindToCtorName(this.genericKind))
		}

		return types
	}
}
