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
	HaysonVal,
	makeValue,
	valueIsKind,
	Kind,
} from 'haystack-core'
import { readFile, readdir } from 'fs'
import path from 'path'
import { promisify } from 'util'
import colors from 'colors/safe'
import AdmZip from 'adm-zip'
import YAML from 'yaml'

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

const DEF_FILE_EXTS = ['.trio', '.hayson.yaml', '.hayson.yml', '.hayson.json']

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
 * Resolve the namespace from some POD files.
 *
 * @param podDir The directory to read the pod files from.
 * @param podFilter If non-empty, used to filter certain POD files.
 * @returns The generated namespace.
 */
export async function resolvePodsNamespace(
	podDir: string,
	podFilter = ''
): Promise<HNamespace> {
	const podsToLibDefs = await getPodToLibDefs(podDir, podFilter)
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
 * Asynchronously load POD to lib defs.
 *
 * This will filter out any POD files that don't have any defs.
 *
 * @param podDir The POD file directory.
 * @param podFilter If not empty, used to filter the POD files used.
 * @returns A map of pods to lib defs dicts.
 */
async function getPodToLibDefs(
	podDir: string,
	podFilter: string
): Promise<Map<Pod, HLibDict>> {
	const pods = await getPods(podDir, podFilter)

	const map = new Map<Pod, HLibDict>()

	for (const pod of pods) {
		for (const ext of DEF_FILE_EXTS) {
			const dicts = readDicts(pod, `lib/lib${ext}`)

			if (dicts?.length) {
				map.set(pod, dicts[0] as HLibDict)
				break
			}
		}
	}

	return map
}

/**
 * Return an array of PODs.
 *
 * @param podDir The POD file directory.
 * @param podFilter If non-empty, used to filter the POD files used.
 * @returns An array of PODs.
 */
async function getPods(podDir: string, podFilter: string): Promise<Pod[]> {
	let files = await readdirAsync(podDir)

	files = files.filter((file) => file.toLowerCase().endsWith('.pod'))

	const fileNames = files.map((file) => file.substring(0, file.length - 4))
	const zips = files.map((file) => new AdmZip(path.join(podDir, file)))

	return (
		fileNames
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
			// If specified, filter the POD files scanned. We have to do this for
			// SkySpark since some of the def library creation is dynamic.
			.filter((pod) =>
				podFilter ? pod.name.startsWith(podFilter) : true
			)
	)
}

/**
 * Load the dicts from the POD lib folder.
 *
 * @param pod To load all the dicts from.
 * @returns An array of def/defx dicts.
 */
function readDictsFromPodLibFolder(pod: Pod): (HDefDict | HDefxDict)[] {
	const files = pod.listFiles('lib')

	return files
		.filter((path) => {
			const lowerPath = path.toLowerCase()
			return DEF_FILE_EXTS.some((ext) => lowerPath.endsWith(ext))
		})
		.map((path): HDict[] => readDicts(pod, path) ?? [])
		.reduce((dicts, prev): HDict[] => dicts.concat(prev), []) as (
		| HDefDict
		| HDefxDict
	)[]
}

function readDicts(pod: Pod, path: string): HDict[] | undefined {
	const text = pod.getAsset(path)
	let dicts: HDict[] | undefined

	if (text) {
		const lowerPath = path.toLowerCase()

		try {
			if (lowerPath.endsWith('.trio')) {
				dicts = new TrioReader(text).readAllDicts()
			} else if (lowerPath.endsWith('.hayson.json')) {
				dicts = convertHaysonToDicts(JSON.parse(text) as HaysonVal)
			} else if (
				lowerPath.endsWith('.hayson.yaml') ||
				lowerPath.endsWith('.hayson.yml')
			) {
				dicts = []
				for (const decoded of YAML.parseAllDocuments(text).map((doc) =>
					doc.toJSON()
				) as HaysonVal[]) {
					dicts = dicts.concat(convertHaysonToDicts(decoded))
				}
			}
		} catch (error) {
			throw new Error(
				`Error parsing '${pod.name}.pod:/${path}' - ${error}`
			)
		}
	}

	return dicts
}

function convertHaysonToDicts(hayson: HaysonVal): HDict[] {
	const dicts: HDict[] = []

	function read(value: HaysonVal): void {
		if (value) {
			const hval = makeValue(value)

			if (valueIsKind<HDict>(hval, Kind.Dict)) {
				dicts.push(hval)
			}
		}
	}

	if (Array.isArray(hayson)) {
		hayson.forEach(read)
	} else {
		read(hayson)
	}

	return dicts
}
