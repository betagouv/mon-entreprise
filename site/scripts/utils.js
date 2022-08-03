import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const dataDir = join(
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
