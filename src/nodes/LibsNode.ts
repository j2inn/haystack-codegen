/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { HDict } from 'haystack-core'
import { Node } from './Node'

/**
 * Generates exported lib information.
 */
export class LibsNode implements Node {
	readonly newLines = 1

	readonly #libs = new Set<HDict>()

	generateCode(out: (code: string) => void): void {
		const libs = [...this.#libs]

		out('/**')
		out(' * Libraries used for code generation.')
		out(' */')
		out(`export const LIBS = [${!libs.length ? ']' : ''}`)

		if (libs.length) {
			libs.forEach((lib: HDict, i: number): void => {
				const name = lib.defName
				const version = lib.get('version')?.toString() ?? ''

				out('	{')
				out(`		name: '${name}',`)
				out(`		version: '${version}',`)
				out('	},')
			})

			out(']')
		}
	}

	/**
	 * Add a lib def to the node.
	 *
	 * @param lib The lib to add.
	 */
	addLib(lib: HDict): void {
		this.#libs.add(lib)
	}
}
