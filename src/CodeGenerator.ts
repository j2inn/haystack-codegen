/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import {
	HNamespace,
	HStr,
	HDict,
	HSymbol,
	valueIsKind,
	Kind,
} from 'haystack-core'
import { DocNode } from './nodes/DocNode'
import { InterfaceNode } from './nodes/InterfaceNode'
import { InterfaceValueNode } from './nodes/InterfaceValueNode'
import { NamespaceNode } from './nodes/NamespaceNode'
import { TypeGuardNode } from './nodes/TypeGuardNode'
import { generateCodeFromNode, makeTypeName } from './nodes/util'

/**
 * Reserved words for features.
 */
const RESERVED_FEATURE_NAMES = ['valueIsKind']

/**
 * Typeguard options.
 */
export enum TypeGuardOptions {
	entity = 'entity',
	all = 'all',
}

/**
 * Generate code for a TypeScript document.
 */
export class CodeGenerator {
	/**
	 * The def names.
	 */
	readonly #names: string[]

	/**
	 * The defs namespace.
	 */
	readonly #namespace: HNamespace

	/**
	 * Typeguard options.
	 */
	readonly #typeGuardOptions: TypeGuardOptions

	/**
	 * Construct a new code generator.
	 *
	 * @param names The names of the defs to generate the code for.
	 * @param namespace The defs namespace.
	 */
	public constructor({
		names,
		namespace,
		typeGuardOptions,
	}: {
		names: string[]
		namespace: HNamespace
		typeGuardOptions: TypeGuardOptions
	}) {
		this.#names = names
		this.#namespace = namespace
		this.#typeGuardOptions = typeGuardOptions
	}

	/**
	 * Generate code from a node.
	 *
	 * @returns The TypeScript code.
	 */
	public generate(): string {
		const doc = new DocNode()

		for (const name of this.removeDuplicates(this.#names)) {
			if (!this.#namespace.has(name)) {
				throw new Error(`Could not find def for ${name}`)
			}

			this.addInterface(name, doc)
		}

		return generateCodeFromNode(doc)
	}

	/**
	 * Add an interface node.
	 *
	 * @param doc The document node.
	 * @param name The name of the interface to add.
	 */
	private addInterface(name: string, doc: DocNode): void {
		const tags = this.#namespace.tags(name)
		const def = this.#namespace.byName(name)

		if (def) {
			this.addLib(def, doc)
		}

		const intNode = new InterfaceNode({
			def: name,
			name: makeTypeName(name),
			doc: def?.get<HStr>('doc')?.value ?? '',
		})

		this.addExtends(name, doc, intNode)
		this.addValues(name, tags, intNode)

		if (HNamespace.isFeature(name)) {
			this.addNamespace(name, doc, intNode)
		} else {
			doc.addInterface(intNode)

			if (
				!HNamespace.isConjunct(name) &&
				def &&
				!CodeGenerator.isDefFromCorePh(def)
			) {
				if (
					this.#typeGuardOptions === TypeGuardOptions.all ||
					this.#namespace.fitsEntity(name)
				) {
					this.addTypeGuard(name, doc)
				}
			}
		}
	}

	/**
	 * Add the lib for the def to the libs node.
	 *
	 * @param def The def.
	 * @param doc The document node.
	 */
	private addLib(def: HDict, doc: DocNode): void {
		const lib = def?.get('lib')
		if (valueIsKind<HSymbol>(lib, Kind.Symbol)) {
			const libDef = this.#namespace.get(lib)

			if (libDef) {
				doc.libs.addLib(libDef)
			}
		}
	}

	/**
	 * Return true if the def is from the core project haystack library.
	 *
	 * @param def The def to test.
	 * @returns True if the def is from the core project haystack library.
	 */
	private static isDefFromCorePh(def: HDict): boolean {
		return def.get<HSymbol>('lib')?.value === 'lib:ph'
	}

	/**
	 * Add the what types the interface extends from by querying the namespace.
	 *
	 * @param name The name of the def to query the super types from.
	 * @param doc The document node.
	 * @param intNode The interface name to add the extend types to.
	 */
	private addExtends(
		name: string,
		doc: DocNode,
		intNode: InterfaceNode
	): void {
		for (const sup of this.#namespace.superTypesOf(name)) {
			intNode.extend.push(makeTypeName(sup.defName))
			this.addInterface(sup.defName, doc)
		}
	}

	/**
	 * Add all the values to the interface node.
	 *
	 * @param name The name of the interface node.
	 * @param tags The tags to query.
	 * @param intNode The interface node to add the values to.
	 */
	private addValues(
		name: string,
		tags: HDict[],
		intNode: InterfaceNode
	): void {
		// Add all tags that relate to this def.
		const tagSet = new Set<HDict>()

		for (const tag of tags) {
			for (const tagOn of this.#namespace.tagOn(tag.defName)) {
				if (
					tagOn.defName === name &&
					!this.propertyAlreadyExistOnHDict(tag.defName) &&
					!tagSet.has(tag)
				) {
					const kind = this.#namespace.defToKind(tag.defName)

					const optional = !tag.has('mandatory')

					if (kind) {
						tagSet.add(tag)

						intNode.values.push(
							new InterfaceValueNode(
								tag.defName,
								tag.get<HStr>('doc')?.value ?? '',
								kind,
								optional
							)
						)
					}
				}
			}
		}
	}

	/**
	 * Add a namespace.
	 *
	 * @param name The name of the def.
	 * @param doc The document node.
	 * @param intNode The interface node.
	 */
	private addNamespace(
		name: string,
		doc: DocNode,
		intNode: InterfaceNode
	): void {
		let feature = name.split(':')[0]

		if (RESERVED_FEATURE_NAMES.includes(feature)) {
			feature += '_'
		}

		const featureDef = this.#namespace.byName(feature)

		doc.addNamespace(
			new NamespaceNode(
				feature ?? '',
				intNode,
				featureDef?.get<HStr>('doc')?.value ?? ''
			)
		)
	}

	/**
	 * Add a type guard.
	 *
	 * @param name The name of the def.
	 * @param doc The document node.
	 */
	private addTypeGuard(name: string, doc: DocNode): void {
		doc.addTypeGuard(
			new TypeGuardNode(
				name,
				makeTypeName(name),
				this.#namespace.allSubTypesOf(name).map((def) => def.defName)
			)
		)
	}

	/**
	 * Return true if the property already exists on HDict.
	 *
	 * @param prop The property name.
	 * @returns True if it exists.
	 */
	private propertyAlreadyExistOnHDict(prop: string): boolean {
		return !!(HDict.prototype as unknown as Record<string, unknown>)[prop]
	}

	/**
	 * Remove any duplicates from the array.
	 *
	 * @param names The names process.
	 * @returns The array with no duplicates.
	 */
	private removeDuplicates(names: string[]): string[] {
		const set = new Set<string>()
		names.forEach(set.add, set)
		return [...names]
	}
}
