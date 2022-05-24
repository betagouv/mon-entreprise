/* eslint-env node */
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import Engine from 'publicodes'

const publicodesDir = './règles'
const outDir = './dist'

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir)
}

function recursiveFindYamlFile(dirPath = publicodesDir) {
	return fs
		.readdirSync(dirPath)
		.flatMap((filename) => {
			const fullpath = path.join(dirPath, filename)
			if (fs.statSync(fullpath).isDirectory()) {
				return recursiveFindYamlFile(fullpath)
			} else {
				return filename.endsWith('.yaml') ? fullpath : false
			}
		})
		.filter(Boolean)
}

function readRules() {
	return recursiveFindYamlFile().reduce((rules, filePath) => {
		const newRules = yaml.load(fs.readFileSync(filePath, 'utf-8'), {
			filename: filePath,
		})
		const duplicatedRule = Object.keys(newRules).find(
			(ruleName) => ruleName in rules
		)
		if (duplicatedRule) {
			throw new Error(
				`La règle ${duplicatedRule} a été redéfinie dans dans le fichier ${filePath}, alors qu'elle avait déjà été définie auparavant dans un autre fichier`
			)
		}
		return Object.assign(rules, newRules)
	}, {})
}

export default function writeJSFile() {
	const rules = readRules()
	const names = Object.keys(new Engine(rules).getParsedRules())
	const jsString = `export default ${JSON.stringify(rules, null, 2)}`
	fs.writeFileSync(path.resolve(outDir, 'index.js'), jsString)
	fs.writeFileSync(
		path.resolve(outDir, 'names.ts'),
		`\nexport type Names = ${names.map((name) => `"${name}"`).join('\n  | ')}\n`
	)
}

writeJSFile()
