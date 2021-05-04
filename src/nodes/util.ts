/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import { Node } from './Node'
import {
	Kind,
	HBool,
	HCoord,
	HDate,
	HDateTime,
	HDict,
	HGrid,
	HList,
	HMarker,
	HNa,
	HNum,
	HRef,
	HRemove,
	HStr,
	HSymbol,
	HTime,
	HXStr,
	HNamespace,
	HUri,
} from 'haystack-core'

const RESERVED_NAMES = [
	'Date',
	'Kind',
	'HBool',
	'HCoord',
	'HDate',
	'HDateTime',
	'HDict',
	'HGrid',
	'HList',
	'HMarker',
	'HNa',
	'HNum',
	'HRef',
	'HRemove',
	'HStr',
	'HSymbol',
	'HTime',
	'HXStr',
	'HNamespace',
	'HUri',
	'valueIsKind',
]

/**
 * Generate the code string from a group of nodes.
 *
 * @param out The output to write too.
 * @param nodes The nodes.
 * @returns The code.
 */
export function generateNodes(
	out: (code: string) => void,
	nodes: Node[]
): void {
	for (const node of nodes) {
		let isEmpty = true
		node.generateCode((code: string) => {
			if (code) {
				isEmpty = false
				out(code)
			}
		})

		if (!isEmpty) {
			for (let i = 0; i < node.newLines; ++i) {
				out('')
			}
		}
	}
}

/**
 * Return the generated code from the node.
 *
 * @param node The node to run.
 * @returns The generated code.
 */
export function generateCodeFromNode(node: Node): string {
	let str = ''
	node.generateCode((code: string) => {
		str += code + '\n'
	})
	return str
}

/**
 * Return a name that can be used as a type.
 *
 * @param name The name to create the type name from.
 * @returns The type name.
 */
export function makeTypeName(name: string): string {
	if (!name) {
		throw new Error(`Invalid interface name: ${name}`)
	}

	if (HNamespace.isConjunct(name)) {
		name = HNamespace.splitConjunct(name)
			.map((nm, i) => (i > 0 ? capitalizeFirstChar(nm) : nm))
			.join('_')
	}

	if (HNamespace.isFeature(name)) {
		name = name.split(':')[1]
	}

	let interfaceName = capitalizeFirstChar(name)

	if (RESERVED_NAMES.includes(interfaceName)) {
		interfaceName = `I${interfaceName}`
	}

	return interfaceName
}

/**
 * Capitalize the first character of the string.
 *
 * @param str The string to capitalize the first letter of.
 * @returns A string with the first letter being a capital.
 */
export function capitalizeFirstChar(str: string): string {
	return str && str.length > 0
		? `${str[0].toUpperCase()}${str.substring(1, str.length)}`
		: ''
}

/**
 * Convert the haystack kind to the name of the `haystack-core` contructor name.
 *
 * @param kind The haystack kind value.
 * @returns The constructor name.
 * @throws If the kind is unsupported or invalid.
 */
export function convertKindToCtorName(kind: Kind): string {
	switch (kind) {
		case Kind.Bool:
			return HBool.name
		case Kind.Coord:
			return HCoord.name
		case Kind.Date:
			return HDate.name
		case Kind.DateTime:
			return HDateTime.name
		case Kind.Dict:
			return HDict.name
		case Kind.Grid:
			return HGrid.name
		case Kind.List:
			return HList.name
		case Kind.Marker:
			return HMarker.name
		case Kind.NA:
			return HNa.name
		case Kind.Number:
			return HNum.name
		case Kind.Ref:
			return HRef.name
		case Kind.Remove:
			return HRemove.name
		case Kind.Str:
			return HStr.name
		case Kind.Symbol:
			return HSymbol.name
		case Kind.Time:
			return HTime.name
		case Kind.XStr:
			return HXStr.name
		case Kind.Uri:
			return HUri.name
		default:
			throw new Error(`Unsupported kind: ${kind}`)
	}
}

/**
 * Write the document comments.
 *
 * @param out Used to output the code.
 * @param doc The documentation to write.
 */
export function writeDocComment(
	out: (code: string) => void,
	doc: string
): void {
	if (doc.trim()) {
		out(' *')
		doc.split('\n').forEach((line) => out(` * ${line.trim()}`))
	}
}
