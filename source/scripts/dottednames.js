// It is currently not possible to automatically type yaml import with
// Typescript types, so we manually watch the yaml file containing the rules,
// convert it to json and persit it on the file system so that we can access the
// list of dotted names in the Typescript types.
//
// A fututre version of typescript may support "plugin" to type files such as
// yaml.

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const sourcePath = path.resolve(__dirname, '../règles/base.yaml')
const outPath = path.resolve(__dirname, '../types/dottednames.json')

function persistJsonFileFromYaml() {
	const source = fs.readFileSync(sourcePath)
	const jsonString = JSON.stringify(yaml.safeLoad(source.toString()), null, 2)
	fs.writeFileSync(outPath, jsonString)
}

persistJsonFileFromYaml()
exports.watchDottedNames = () => fs.watch(sourcePath, persistJsonFileFromYaml)
