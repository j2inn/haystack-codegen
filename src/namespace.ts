/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

import {
	HNormalizer,
	HNamespace,
	ZincReader,
	HGrid,
	LibScanner,
	HDefDict,
	HDefxDict,
	TrioReader,
	HLibDict,
	HDict,
	HLib,
} from 'haystack-core'
import { readFile, readdir } from 'fs'
import path from 'path'
import { promisify } from 'util'
import colors from 'colors/safe'
import AdmZip from 'adm-zip'

const readFileAsync = promisify(readFile)
const readdirAsync = promisify(readdir)

/**
 * Resolve the default namespace from defs distributed with the project.
 *
 * @returns The default namespace.
 */
export async function resolveDefaultNamespace(): Promise<HNamespace> {
	const defsBuf = await readFileAsync(path.join(__dirname, '../rc/defs.zinc'))
	const grid = ZincReader.readValue(defsBuf.toString('utf-8')) as HGrid
	return new HNamespace(grid)
}

/**
 * Resolve the namespace from some POD files.
 *
 * @param podDir The directory to read the pod files from.
 * @returns The generated namespace.
 */
export async function resolvePodsNamespace(podDir: string) {
	const podsToLibDefs = await getPodToLibDefs(podDir)
	const pods = [...podsToLibDefs.keys()]

	const logger = {
		warning(message: string): void {
			console.log('      ' + colors.green(message))
		},
		error(message: string): void {
			console.warn('      ' + colors.yellow(message))
		},
		fatal(message: string): void {
			console.error('      ' + colors.red(message))
		},
	}

	if (!pods.length) {
		logger.warning('No pods found.')
		return new HNamespace(HGrid.make({}))
	}

	const loadLib = async (pod: Pod): Promise<HLib> => {
		const lib = podsToLibDefs.get(pod) as HLibDict

		return {
			name: pod.name,
			lib,
			dicts: readDictsFromPodLibFolder(pod),
		}
	}

	const scanner: LibScanner = () => pods.map(loadLib)
	return await new HNormalizer(scanner, logger).normalize()
}

/**
 * Represents a POD file.
 */
interface Pod {
	/**
	 * The name of the POD.
	 */
	name: string

	/**
	 * Load an asset as a string.
	 *
	 * @param path The path to the asset in the file.
	 * @returns The asset as a string or undefined if it doesn't exist.
	 */
	getAsset(path: string): string | undefined

	/**
	 * List the paths in the POD file.
	 *
	 * @param dir The path within the POD file.
	 * @returns An array of paths within the POD file.
	 */
	listFiles(dir: string): string[]
}

/**
 * Return an array of PODs.
 *
 * @param podDir The POD file directory.
 * @returns An array of PODs.
 */
async function getPods(podDir: string): Promise<Pod[]> {
	let files = await readdirAsync(podDir)

	files = files.filter((file) => file.toLowerCase().endsWith('.pod'))

	const fileNames = files.map((file) => file.substring(0, file.length - 4))
	const zips = files.map((file) => new AdmZip(path.join(podDir, file)))

	return fileNames
		.map(
			(fileName, i): Pod => ({
				name: fileName,
				getAsset: (path: string): string | undefined => {
					try {
						return zips[i].readAsText(path)
					} catch (err) {
						return undefined
					}
				},
				listFiles: (path: string): string[] =>
					zips[i]
						.getEntries()
						.map((entry) => entry.entryName)
						.filter((entryName) => entryName.startsWith(path)),
			})
		)
		.filter((pod) => pod.name.startsWith('ph'))
}

/**
 * Asynchronously load POD to lib defs.
 *
 * This will filter out any POD files that don't have any defs.
 *
 * @returns A map of pods to lib defs dicts.
 */
async function getPodToLibDefs(podDir: string): Promise<Map<Pod, HLibDict>> {
	const pods = await getPods(podDir)

	const map = new Map<Pod, HLibDict>()

	for (const pod of pods) {
		const libTrio = pod.getAsset('lib/lib.trio')

		if (libTrio) {
			map.set(pod, new TrioReader(libTrio).readDict() as HLibDict)
		}
	}

	return map
}

/**
 * Load the dicts from the POD lib folder.
 *
 * @param pod To load all the dicts from.
 * @returns An array of def/defx dicts.
 */
function readDictsFromPodLibFolder(pod: Pod): (HDefDict | HDefxDict)[] {
	const trios = pod
		.listFiles('lib')
		.filter((path) => path.toLowerCase().endsWith('.trio'))
		.map((path) => pod.getAsset(path))

	return trios
		.filter((trio) => !!trio)
		.map((trio) => new TrioReader(String(trio)).readAllDicts())
		.reduce((dicts, prev): HDict[] => dicts.concat(prev), []) as (
		| HDefDict
		| HDefxDict
	)[]
}
