// In a vanilla NodeJS environment it is not possible to use the "import"
// statement with the Webpack transformer (from yaml to json).

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const publicodesDir = path.resolve(__dirname, '../../publicode/rules')

function readRules() {
	const concatenatedFile = fs
		.readdirSync(publicodesDir)
		.map(filename => {
			return fs.readFileSync(path.join(publicodesDir, filename))
		})
		.reduce((acc, cur) => acc + '\n' + cur, '')
	return yaml.safeLoad(concatenatedFile)
}

exports.readRules = readRules
