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

	public readonly kind: Kind

	public readonly optional: boolean

	/**
	 * The number of new lines after this node is set dynamically depending on its
	 * position in the parent interface.
	 */
	public newLines = 1

	public constructor(
		name: string,
		doc: string,
		kind: Kind,
		optional = false
	) {
		this.name = name
		this.doc = doc
		this.kind = kind
		this.optional = optional
	}

	public generateCode(out: (code: string) => void): void {
		if (this.doc.trim()) {
			out('	/**')
			writeDocComment((code: string): void => out(`	${code}`), this.doc)
			out('	 */')
		}

		out(`	${this.name}${this.optional ? '?' : ''}: ${this.type}`)
	}

	/**
	 * Returns the haystack value's constructor name based on the kind.
	 *
	 * @param kind The kind.
	 * @returns The TypeScript haystack value's name.
	 */
	public get type(): string {
		return convertKindToCtorName(this.kind)
	}
}
