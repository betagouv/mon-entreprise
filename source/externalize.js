var yaml = require('js-yaml')
var fs = require('fs')
var translate = require('google-translate-api')
var path = require('path')
let R = require('ramda')

translate(
	'Bonjour, je suis votre agent traducteur. Je vais traduire votre application, puis ensuite dominer le monde',
	{ from: 'fr', to: 'en' }
)
	.then(res => {
		console.log(res.text)
	})
	.catch(err => {
		console.error(err)
	})

rules = yaml.safeLoad(
	fs.readFileSync(path.resolve('source/règles/base.yaml'), 'utf-8')
)

let attributesToExternalize = [
	'titre',
	'description',
	'question',
	'sous-question',
	'résumé'
]

let promises = rules
	.map(rule => (!rule.titre ? { ...rule, titre: rule.nom } : rule))
	.map(rule =>
		Promise.all(
			R.toPairs(rule).map(([k, v]) => {
				let attrToTranslate = attributesToExternalize.find(R.equals(k))
				if (!attrToTranslate) return Promise.resolve({})
				return translate(v, { from: 'fr', to: 'en' }).then(({ text }) => ({
					[attrToTranslate + '.fr']: v,
					[attrToTranslate + '.en']: text
				}))
			})
		).then(attributes => {
			let id = rule.espace ? rule.espace + ' . ' + rule.nom : rule.nom
			return { [id]: R.mergeAll(attributes) }
		})
	)

Promise.all(promises).then(resolved =>
	fs.writeFileSync(
		'source/règles/externalized.yaml',
		yaml.safeDump(R.mergeAll(resolved))
	)
)
