// It is currently not possible to automatically type yaml import with
// Typescript types, so we manually watch the yaml file containing the rules,
// convert it to json and persit it on the file system so that we can access the
// list of dotted names in the Typescript types.
//
// A fututre version of typescript may support "plugin" to type files such as
// yaml.

const fs = require('fs')
const path = require('path')
const { readRules } = require('./rules')

const sourceDirPath = path.resolve(__dirname, '../source/rules')
// Note: we can't put the output file in the fs.watched directory
const outPath = path.resolve(__dirname, '../source/types/dottednames.json')

function persistJsonFileFromYaml() {
	const rules = readRules()
	const jsonString = JSON.stringify(rules, null, 2)
	fs.writeFileSync(outPath, jsonString)
}

persistJsonFileFromYaml()
exports.watchDottedNames = () =>
	fs.watch(sourceDirPath, persistJsonFileFromYaml)
