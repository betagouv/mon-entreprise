require('dotenv').config()
require('isomorphic-fetch')
var fs = require('fs')
var path = require('path')
let R = require('ramda')
var querystring = require('querystring')

let { safeLoad } = require('js-yaml')
let rulesTranslationPath = path.resolve('source/règles/externalized.yaml')
let UiTranslationPath = path.resolve('source/locales/en.yaml')

function getRulesMissingTranslations() {
	let rules = safeLoad(
		fs.readFileSync(path.resolve('source/règles/base.yaml'), 'utf-8')
	)

	let currentExternalization = safeLoad(
		fs.readFileSync(rulesTranslationPath, 'utf-8')
	)

	let attributesToExternalize = [
		'titre',
		'description',
		'question',
		'résumé',
		'suggestions',
		'contrôles'
	]
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

const getUiMissingTranslations = () => {
	const staticKeys = require(path.resolve(
		'source/locales/static-analysis-fr.json'
	))
	const translatedKeys = safeLoad(fs.readFileSync(UiTranslationPath, 'utf-8'))

	const missingTranslations = Object.keys(staticKeys).filter(key => {
		if (key.match(/^\{.*\}$/)) {
			return false
		}
		const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
		return !R.path(keys, translatedKeys)
	}, staticKeys)
	return R.pick(missingTranslations, staticKeys)
}

const fetchTranslation = async text => {
	console.log(`Fetch translation for:\n\t${text}`)
	const response = await fetch(
		`https://api.deepl.com/v2/translate?${querystring.stringify({
			text,
			auth_key: process.env.DEEPL_API_SECRET,
			tag_handling: 'xml',
			source_lang: 'FR',
			target_lang: 'EN'
		})}`
	)
	const { translations } = await response.json()
	return translations[0].text
}
module.exports = {
	fetchTranslation,
	getRulesMissingTranslations,
	getUiMissingTranslations,
	rulesTranslationPath,
	UiTranslationPath
}
