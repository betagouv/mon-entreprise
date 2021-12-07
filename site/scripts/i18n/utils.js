require('dotenv').config()
require('isomorphic-fetch')
var fs = require('fs')
var path = require('path')
let R = require('ramda')
var querystring = require('querystring')
require('../../../modele-social/build')
let rules = require('../../../modele-social')
let { parse } = require('yaml')

let rulesTranslationPath = path.resolve('site/source/locales/rules-en.yaml')
let UiTranslationPath = path.resolve('site/source/locales/ui-en.yaml')
let UiOriginalTranslationPath = path.resolve('site/source/locales/ui-fr.yaml')

let attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
]

function getRulesMissingTranslations() {
	let currentExternalization = parse(
		fs.readFileSync(rulesTranslationPath, 'utf-8')
	)

	let missingTranslations = []
	let resolved = Object.entries(rules)
		.map(([dottedName, rule]) => [
			dottedName,
			!rule || !rule.titre // && utils.ruleWithDedicatedDocumentationPage(rule))
				? { ...rule, titre: dottedName.split(' . ').slice(-1)[0] }
				: rule,
		])
		.map(([dottedName, rule]) => ({
			[dottedName]: R.mergeAll(
				R.toPairs(rule)
					.filter(([, v]) => !!v)
					.map(([k, v]) => {
						let attrToTranslate = attributesToTranslate.find(R.equals(k))
						if (!attrToTranslate) return {}
						let enTrad = attrToTranslate + '.en',
							frTrad = attrToTranslate + '.fr'

						let currentTranslation = currentExternalization[dottedName]

						if ('suggestions' === attrToTranslate) {
							return Object.keys(v).reduce((acc, suggestion) => {
								const enTrad = `suggestions.${suggestion}.en`
								const frTrad = `suggestions.${suggestion}.fr`
								if (
									currentTranslation &&
									currentTranslation[enTrad] &&
									currentTranslation[frTrad] === suggestion
								) {
									return {
										...acc,
										[frTrad]: currentTranslation[frTrad],
										[enTrad]: currentTranslation[enTrad],
									}
								}
								missingTranslations.push([dottedName, enTrad, suggestion])
								return {
									...acc,
									[frTrad]: suggestion,
								}
							}, {})
						}

						// Check if a human traduction exists already for this attribute and if
						// it does need to be updated
						if (
							currentTranslation &&
							currentTranslation[enTrad] &&
							currentTranslation[frTrad] === v
						)
							return {
								[enTrad]: currentTranslation[enTrad],
								[frTrad]: v,
							}

						missingTranslations.push([dottedName, enTrad, v])
						return {
							[frTrad]: v,
						}
					})
			),
		}))
	resolved = R.mergeAll(resolved)
	return [missingTranslations, resolved]
}

const getUiMissingTranslations = () => {
	const staticKeys = require(path.resolve(
		'site/source/locales/static-analysis-fr.json'
	))
	const translatedKeys = parse(fs.readFileSync(UiTranslationPath, 'utf-8'))
	const originalKeys = parse(
		fs.readFileSync(UiOriginalTranslationPath, 'utf-8')
	)

	const missingTranslations = Object.entries(staticKeys)
		.filter(([key, valueInSource]) => {
			if (key.match(/^\{.*\}$/) || valueInSource === 'NO_TRANSLATION') {
				return false
			}
			const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)

			const isNewKey = !R.path(keys, translatedKeys)
			const isInvalidatedKey = R.path(keys, originalKeys) !== valueInSource

			return isNewKey || isInvalidatedKey
		}, staticKeys)
		.map(([key]) => key)

	return R.pick(missingTranslations, staticKeys)
}

const fetchTranslation = async (text) => {
	const response = await fetch(
		`https://api.deepl.com/v2/translate?${querystring.stringify({
			text,
			auth_key: process.env.DEEPL_API_SECRET,
			tag_handling: 'xml',
			source_lang: 'FR',
			target_lang: 'EN',
		})}`
	)
	try {
		const { translations } = await response.json()
		console.log(`✅ Deepl translation succeeded for:\n\t${text}\n`)
		return translations[0].text
	} catch (e) {
		console.warn(`❌ Deepl translation failed for:\n\t${text}\n`)
		return ''
	}
}
module.exports = {
	fetchTranslation,
	getRulesMissingTranslations,
	getUiMissingTranslations,
	rulesTranslationPath,
	UiTranslationPath,
	UiOriginalTranslationPath,
}
