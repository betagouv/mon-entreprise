/* eslint-env node */

import {
	existsSync,
	mkdirSync,
	readdirSync,
	statSync,
	readFileSync,
	writeFileSync,
	watch,
} from 'fs'
import { fileURLToPath } from 'url'
import { resolve, join } from 'path'
import yaml from 'yaml'

const __dirname = fileURLToPath(import.meta.url)
const publicodesDir = resolve(__dirname, '../règles')
const outDir = resolve(__dirname, '../dist')

if (!existsSync(outDir)) {
	mkdirSync(outDir)
}

function concatenateFilesInDir(dirPath = publicodesDir) {
	return readdirSync(dirPath)
		.map((filename) => {
			const fullpath = join(dirPath, filename)
			if (statSync(fullpath).isDirectory()) {
				return concatenateFilesInDir(fullpath)
			} else {
				return filename.endsWith('.yaml') ? readFileSync(fullpath) : ''
			}
		})
		.reduce((acc, cur) => acc + '\n' + cur, '')
}

function readRules() {
	return yaml.parse(concatenateFilesInDir())
}

// Note: we can't put the output file in the fs.watched directory

function writeJSFile() {
	const rules = readRules()
	const names = Object.keys(rules)
	const jsString = `export default ${JSON.stringify(rules, null, 2)}`
	writeFileSync(resolve(outDir, 'index.js'), jsString)
	writeFileSync(
		resolve(outDir, 'names.ts'),
		`\nexport type Names = ${names.map((name) => `"${name}"`).join('\n  | ')}\n`
	)
}

writeJSFile()
export function watchDottedNames() {
	return watch(publicodesDir, writeJSFile)
}
