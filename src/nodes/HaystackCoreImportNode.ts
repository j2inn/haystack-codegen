/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Node } from './Node'

/**
 * Generates the imports from the haystack-core library.
 */
export class HaystackCoreImportNode implements Node {
	public readonly types = new Set<string>()

	public readonly newLines = 1

	public constructor(types: string[] = []) {
		for (const type of types) {
			this.types.add(type)
		}
	}

	public generate(out: (code: string) => void): void {
		if (this.types.size) {
			out(`import { ${[...this.types].join(', ')} } from 'haystack-core'`)
		}
	}
}
