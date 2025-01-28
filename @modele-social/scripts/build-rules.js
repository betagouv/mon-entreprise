import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'

import { getModelFromSource } from '@publicodes/tools/compilation'
import Engine from 'publicodes'

export function buildRules(moduleName, rulesDir, outDir) {
	const rules = getModelFromSource(rulesDir, { verbose: true })

	const json = JSON.stringify(JSON.stringify(rules))
	const names = Object.keys(new Engine(rules).getParsedRules())
	const jsString = `export const json = /*@__PURE__*/ ${json};\nexport default /*@__PURE__*/ JSON.parse(json);`

	const folder = path.resolve(outDir)
	if (!existsSync(folder)) {
		mkdirSync(folder)
	}
	writeFileSync(path.resolve(outDir, `${moduleName}.model.json`), json)
	writeFileSync(path.resolve(outDir, 'index.js'), jsString)
	writeFileSync(
		path.resolve(outDir, 'names.ts'),
		`\nexport type Names = ${names.map((name) => `"${name}"`).join('\n  | ')}\n`
	)
}
