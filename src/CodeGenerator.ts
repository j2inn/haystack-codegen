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
	HMarker,
} from 'haystack-core'
import { DocNode } from './nodes/DocNode'
import { InterfaceNode } from './nodes/InterfaceNode'
import { InterfaceValueNode } from './nodes/InterfaceValueNode'
import { NamespaceNode } from './nodes/NamespaceNode'
import { TypeGuardNode } from './nodes/TypeGuardNode'
import {
	convertKindToCtorName,
	generateCodeFromNode,
	makeTypeName,
} from './nodes/util'

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
	 * A name to def cache.
	 */
	#nameToDefCache: Record<string, string> = {}

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
		this.#nameToDefCache = {}

		for (const name of this.sortNamesAndFeatures()) {
			if (!this.#namespace.has(name)) {
				throw new Error(`Could not find def for ${name}`)
			}

			this.addInterface(name, doc)
		}

		return generateCodeFromNode(doc)
	}

	/**
	 * Sort alphabetically by names and then features.
	 *
	 * @returns The def names.
	 */
	private sortNamesAndFeatures(): string[] {
		// It's nice not to have underscores added to the end of the non-feature
		// names (duplicates). Therefore process non-feature defs first.

		const names = this.removeDuplicates(this.#names)
		const features: string[] = []

		for (let i = names.length; i >= 0; --i) {
			if (HNamespace.isFeature(names[i])) {
				features.push(names.splice(i, 1)[0])
			}
		}

		return [...names.sort(), ...features.sort()]
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
			name: makeTypeName(name, this.#nameToDefCache),
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
			intNode.extend.push(makeTypeName(sup.defName, this.#nameToDefCache))
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
		// Ensure's no tag is added twice for a node.
		const tagSet = new Set<HDict>()

		const def = this.#namespace.byName(name) as HDict
		if (def.get('mandatory')?.equals(HMarker.make())) {
			this.addValueNode(def, tagSet, intNode, /*optional*/ false)
		}

		for (const tag of tags) {
			for (const tagOn of this.#namespace.tagOn(tag.defName)) {
				if (tagOn.defName === name) {
					this.addValueNode(tag, tagSet, intNode, /*optional*/ true)
				}
			}
		}
	}

	private addValueNode(
		tag: HDict,
		tagSet: Set<HDict>,
		intNode: InterfaceNode,
		optional: boolean
	): void {
		if (
			!this.propertyAlreadyExistOnHDict(tag.defName) &&
			!tagSet.has(tag)
		) {
			const kind = this.#namespace.defToKind(tag.defName)

			if (kind) {
				tagSet.add(tag)

				const genericInfo = this.resolveGenericInfo(tag)

				intNode.values.push(
					new InterfaceValueNode({
						name: tag.defName,
						type: this.resolveType(tag.defName, kind),
						kind,
						doc: tag.get<HStr>('doc')?.value,
						genericType: genericInfo?.type,
						genericKind: genericInfo?.kind,
						optional,
					})
				)
			}
		}
	}

	/**
	 * Return the generic type for the given tag.
	 *
	 * @param tag The tag to resolve the generic parameter from.
	 * @return The generic parameter or an empty string if one can't be resolved.
	 */
	private resolveGenericInfo(tag: HDict):
		| {
				type: string
				kind: Kind
		  }
		| undefined {
		let typeInfo:
			| {
					type: string
					kind: Kind
			  }
			| undefined

		// Currently only support generic types for lists.
		const genericOf =
			(this.#namespace.defToKind(tag.defName) === Kind.List &&
				tag.get<HSymbol>('of')?.value) ||
			''

		if (genericOf) {
			const genericKind = this.#namespace.defToKind(genericOf)

			if (genericKind) {
				typeInfo = {
					type: this.resolveType(genericOf, genericKind),
					kind: genericKind,
				}
			}
		}

		return typeInfo
	}

	/**
	 * Resolve the type name using the existing symbol name and kind.
	 *
	 * @param name The name.
	 * @param kind The kind.
	 * @returns The type name to use.
	 */
	private resolveType(name: string, kind: Kind): string {
		// If the kind is a dict then we can map it to a generated dict interface.
		// If the kind is not a dict then map it to its haystack type.
		return kind === Kind.Dict && name !== 'dict'
			? makeTypeName(name, this.#nameToDefCache)
			: convertKindToCtorName(kind)
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
			new TypeGuardNode(name, makeTypeName(name, this.#nameToDefCache))
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
