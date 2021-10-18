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
	public readonly name: string

	public readonly doc: string

	public readonly type: string

	public readonly kind: Kind

	public readonly genericType?: string

	public readonly genericKind?: Kind

	public readonly optional: boolean

	/**
	 * The number of new lines after this node is set dynamically depending on its
	 * position in the parent interface.
	 */
	public newLines = 1

	public constructor({
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

	public generateCode(out: (code: string) => void): void {
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
	public get types(): string[] {
		const types = [convertKindToCtorName(this.kind)]

		if (this.genericKind) {
			types.push(convertKindToCtorName(this.genericKind))
		}

		return types
	}
}
