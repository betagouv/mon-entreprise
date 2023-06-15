import { exec as originalExec } from 'child_process'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { relative, resolve } from 'path'
import { promisify } from 'util'

import { getPackageDeps } from '@rushstack/package-deps-hash'

const exec = promisify(originalExec)

type DirPath = string
type FilePath = string

interface Option {
	paths: (DirPath | FilePath)[]
	run: string
}

interface Config {
	basePath: string
	depsPath: string
	options: Option[]
}

type Deps = Record<string, string>

/**
 * Execute a command when a file or a file in the directory changes
 */
export const execOnFileChange = async (config: Config) => {
	const path = resolve(config.basePath, config.depsPath)

	const deps: Deps = Object.fromEntries(getPackageDeps(config.basePath))
	const depsEntries = Object.entries(deps)

	const existingDeps = existsSync(path)
		? (JSON.parse(readFileSync(path, { encoding: 'utf8' })) as Deps)
		: {}
	const existingDepsEntries = Object.entries(existingDeps)

	const promises = config.options.map(async (cfg) => {
		let fileChanged: null | string = null
		const index = cfg.paths
			.map((val) => {
				const isDir = lstatSync(resolve(config.basePath, val)).isDirectory()
				const isFile = lstatSync(resolve(config.basePath, val)).isFile()

				return {
					isDir,
					isFile,
					absolute: resolve(config.basePath, val),
					relative: relative(
						resolve(config.basePath),
						resolve(config.basePath, val)
					),
				}
			})
			.findIndex(({ absolute, relative, isFile, isDir }) => {
				if (isFile) {
					if (deps[relative] !== existingDeps[relative]) {
						fileChanged = relative
					}

					return deps[relative] !== existingDeps[relative]
				} else if (isDir) {
					const index = depsEntries.findIndex(
						([a, b], i) =>
							(relative.length ? a.startsWith(relative + '/') : true) &&
							(existingDepsEntries?.[i]?.[0] !== a ||
								existingDepsEntries?.[i]?.[1] !== b)
					)

					if (index > -1) {
						fileChanged = depsEntries[index][0]
					}

					return index > -1
				}
				throw new Error('Path is not a directory or a file: ' + absolute)
			})

		if (index > -1) {
			const result = await exec(cfg.run)

			return {
				path: cfg.paths[index],
				fileChanged,
				run: cfg.run,
				result,
			}
		}

		return null
	})

	const res = await Promise.all(promises)

	writeFileSync(path, JSON.stringify(deps, null, 2))

	return res
}
