// In a vanilla NodeJS environment it is not possible to use the "import"
// statement with the Webpack transformer (from yaml to json).

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const publicodesDir = path.resolve(__dirname, '../../publicode/rules')

function concatenateFilesInDir(dirPath = publicodesDir) {
	return fs
		.readdirSync(dirPath)
		.map(filename => {
			const fullpath = path.join(dirPath, filename)
			if (fs.statSync(fullpath).isDirectory()) {
				return concatenateFilesInDir(fullpath)
			} else {
				return fs.readFileSync(fullpath)
			}
		})
		.reduce((acc, cur) => acc + '\n' + cur, '')
}

function readRules() {
	return yaml.safeLoad(concatenateFilesInDir())
}

exports.readRules = readRules
