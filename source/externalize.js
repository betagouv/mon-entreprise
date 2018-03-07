var yaml = require('js-yaml')
var fs = require('fs')
var translate = require('google-translate-api')
var path = require('path')
let R = require('ramda')

let externalizationPath = 'source/règles/externalized.yaml'
// Test the translation agent
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

let rules = yaml.safeLoad(
	fs.readFileSync(path.resolve('source/règles/base.yaml'), 'utf-8')
)

let currentExternalization = yaml.safeLoad(
	fs.readFileSync(path.resolve(externalizationPath), 'utf-8')
)

let attributesToExternalize = [
	'titre',
	'description',
	'question',
	'sous-question',
	'résumé'
]

let buildDottedName = rule =>
	rule.espace ? rule.espace + ' . ' + rule.nom : rule.nom

let promises = rules
	.map(rule => (!rule.titre ? { ...rule, titre: rule.nom } : rule))
	.map(rule =>
		Promise.all(
			R.toPairs(rule).map(([k, v]) => {
				let attrToTranslate = attributesToExternalize.find(R.equals(k))
				if (!attrToTranslate) return Promise.resolve({})
				let enTrad = attrToTranslate + '.en',
					frTrad = attrToTranslate + '.fr'

				let currentTranslation = currentExternalization[buildDottedName(rule)]
				//Check if a human traduction exists already for this attribute
				if (currentTranslation[enTrad])
					return Promise.resolve({
						[enTrad]: currentTranslation[enTrad],
						[frTrad]: v
					})
				return translate(v, { from: 'fr', to: 'en' }).then(({ text }) => ({
					[frTrad]: v,
					// Mark auto translated text with a double tild symbol
					[enTrad]: '~~' + text
				}))
			})
		).then(attributes => {
			let id = buildDottedName(rule)
			return { [id]: R.mergeAll(attributes) }
		})
	)

Promise.all(promises).then(resolved =>
	fs.writeFileSync(externalizationPath, yaml.safeDump(R.mergeAll(resolved)))
)
