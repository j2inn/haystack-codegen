/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Node } from './Node'

/**
 * Generates the imports from the haystack-core library.
 */
export class HaystackCoreImportNode implements Node {
	readonly types = new Set<string>()

	readonly newLines = 1

	constructor(types: string[] = []) {
		for (const type of types) {
			this.types.add(type)
		}
	}

	generateCode(out: (code: string) => void): void {
		if (this.types.size) {
			const types = [...this.types.values()]

			out('import {')
			types.forEach((type) =>
				out(`	${type}${types.length === 1 ? '' : ','}`)
			)
			out(`} from 'haystack-core'`)
		}
	}
}
