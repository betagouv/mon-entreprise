import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

export const dataDir = join(
	fileURLToPath(import.meta.url),
	'..',
	'..',
	'source',
	'public',
	'data'
)

export function createDataDir() {
	if (!existsSync(dataDir)) {
		mkdirSync(dataDir)
	}
}

export function writeInDataDir(filename, data) {
	writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2))
}

export function readInDataDir(filename) {
	return JSON.parse(
		readFileSync(join(dataDir, filename), { encoding: 'utf-8' })
	)
}
