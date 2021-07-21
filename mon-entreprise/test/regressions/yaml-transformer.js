// Inspired from yaml-jest https://github.com/danwang/yaml-jest
var crypto = require('crypto')
var yaml = require('js-yaml')
const getCacheKey = (fileData, filePath, options) => {
	return crypto
		.createHash('md5')
		.update(fileData)
		.update(options.configString)
		.digest('hex')
}
const process = (sourceText) => {
	const result = yaml.safeLoad(sourceText)
	const json = JSON.stringify(result, undefined, '\t')
	return `module.exports = ${json}`
}
const transformer = {
	getCacheKey,
	process,
}
module.exports = transformer
