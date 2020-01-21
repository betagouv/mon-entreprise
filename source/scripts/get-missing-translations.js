var fs = require('fs')
var path = require('path')
let R = require('ramda')

let { safeLoad } = require('js-yaml')
let externalizationPath = 'source/règles/externalized.yaml'

let rules = safeLoad(
	fs.readFileSync(path.resolve('source/règles/base.yaml'), 'utf-8')
)

let currentExternalization = safeLoad(
	fs.readFileSync(path.resolve(externalizationPath), 'utf-8')
)

let attributesToExternalize = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'contrôles'
]

function getMissingTranslations() {
	let missingTranslations = []
	let resolved = Object.entries(rules)
		.map(([dottedName, rule]) => [
			dottedName,
			!rule || !rule.titre
				? { ...rule, titre: dottedName.split(' . ').slice(-1)[0] }
				: rule
		])
		.map(([dottedName, rule]) => ({
			[dottedName]: R.mergeAll(
				R.toPairs(rule)
					.filter(([, v]) => !!v)
					.map(([k, v]) => {
						let attrToTranslate = attributesToExternalize.find(R.equals(k))
						if (!attrToTranslate) return {}
						let enTrad = attrToTranslate + '.en',
							frTrad = attrToTranslate + '.fr'

						let currentTranslation = currentExternalization[dottedName]
						// Check if a human traduction exists already for this attribute and if
						// it does need to be updated
						if (
							currentTranslation &&
							currentTranslation[enTrad] &&
							currentTranslation[frTrad] === v
						)
							return {
								[enTrad]: currentTranslation[enTrad],
								[frTrad]: v
							}
						if (['contrôles', 'suggestions'].includes(attrToTranslate)) {
							return {
								[frTrad]: v
							}
						}
						missingTranslations.push([dottedName, enTrad, v])
						return {
							[frTrad]: v
						}
					})
			)
		}))
	resolved = R.mergeAll(resolved)
	return [missingTranslations, resolved]
}

module.exports = {
	getMissingTranslations,
	externalizationPath
}
