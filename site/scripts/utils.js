import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const dataDir = new URL('../source/data/', import.meta.url).pathname

export function createDataDir() {
	if (!existsSync(dataDir)) {
		mkdirSync(dataDir)
	}
}

export function writeInDataDir(filename, data) {
	writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2))
}
