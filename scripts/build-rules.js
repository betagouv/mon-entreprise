import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'

import { getModelFromSource } from '@publicodes/tools/compilation'
import Engine from 'publicodes'

const outDir = './dist'
const sources = [path.resolve('./règles')]
if (!path.resolve('./').endsWith('/modele-social')) {
	sources.push(path.resolve('../modele-commun/règles'))
}
const rules = getModelFromSource(sources, {
	verbose: true,
})

export default function writeJSFile() {
	const json = JSON.stringify(JSON.stringify(rules))
	const names = Object.keys(new Engine(rules).getParsedRules())
	const jsString = `export const json = /*@__PURE__*/ ${json};\nexport default /*@__PURE__*/ JSON.parse(json);`
	// Create folder if doesn't exist
	const folder = path.resolve(outDir)
	if (!existsSync(folder)) {
		mkdirSync(folder)
	}
	writeFileSync(path.resolve(outDir, 'index.js'), jsString)
	writeFileSync(
		path.resolve(outDir, 'names.ts'),
		`\nexport type Names = ${names.map((name) => `"${name}"`).join('\n  | ')}\n`
	)
}

writeJSFile()
