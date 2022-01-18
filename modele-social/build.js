/* eslint-env node */

const fs = require('fs')
const path = require('path')
const yaml = require('yaml')

const publicodesDir = path.resolve(__dirname, './règles')
const outDir = path.resolve(__dirname, './dist')

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir)
}

function concatenateFilesInDir(dirPath = publicodesDir) {
	return fs
		.readdirSync(dirPath)
		.map((filename) => {
			const fullpath = path.join(dirPath, filename)
			if (fs.statSync(fullpath).isDirectory()) {
				return concatenateFilesInDir(fullpath)
			} else {
				return filename.endsWith('.yaml') ? fs.readFileSync(fullpath) : ''
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
	const jsString = `const rules = ${JSON.stringify(
		rules,
		null,
		2
	)}; if (typeof exports === 'object' && typeof module === 'object') {module.exports = rules;} else {this['modeleSocial'] = rules; }`
	fs.writeFileSync(path.resolve(outDir, 'index.js'), jsString)
	fs.writeFileSync(
		path.resolve(outDir, 'names.ts'),
		`\nexport type Names = ${names.map((name) => `"${name}"`).join('\n  | ')}\n`
	)
}

writeJSFile()
exports.watchDottedNames = () => fs.watch(publicodesDir, writeJSFile)
