deep = require('deep-diff').diff

yaml = require('js-yaml')
fs = require('fs')

var base1 = './source/règles/base.yaml'
var base2 = './source/règles/base-originale.yaml'

// Get document, or throw exception on error
try {
	var o1 = yaml.safeLoad(fs.readFileSync(base1, 'utf8'))
	var o2 = yaml.safeLoad(fs.readFileSync(base2, 'utf8'))

	var differences = deep(o1, o2)

	console.log(differences)
} catch (e) {
	console.log(e)
}
