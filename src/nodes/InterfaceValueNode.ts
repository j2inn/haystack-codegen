/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Kind } from 'haystack-core'
import { Node } from './Node'
import { convertKindToCtorName } from './util'

/**
 * Generates a value line in a TypeScript interface.
 */
export class InterfaceValueNode implements Node {
	public readonly name: string

	public readonly kind: Kind

	public readonly optional: boolean

	public readonly newLines = 0

	public constructor(name: string, kind: Kind, optional: boolean = false) {
		this.name = name
		this.kind = kind
		this.optional = optional
	}

	public generate(out: (code: string) => void): void {
		out(`	${this.name}${this.optional ? '?' : ''}: ${this.hvalCtorName}`)
	}

	/**
	 * Returns the haystack value's constructor name based on the kind.
	 *
	 * @param kind The kind.
	 * @returns The TypeScript haystack value's name.
	 */
	public get hvalCtorName(): string {
		return convertKindToCtorName(this.kind)
	}
}
