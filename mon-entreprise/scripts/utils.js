import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const dataDir = resolve(fileURLToPath(import.meta.url), '../../source/data/')

export function createDataDir() {
	if (!existsSync(dataDir)) {
		mkdirSync(dataDir)
	}
}

export function writeInDataDir(filename, data) {
	writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2))
}
