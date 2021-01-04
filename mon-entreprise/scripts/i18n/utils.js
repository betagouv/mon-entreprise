import dotenv from 'dotenv'
dotenv.config()
import 'isomorphic-fetch'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { mergeAll, toPairs, equals, path as _path, pick } from 'ramda'
import { stringify } from 'querystring'
import rules from 'modele-social'
import yaml from 'yaml'

let rulesTranslationPath = resolve('source/locales/rules-en.yaml')
let UiTranslationPath = resolve('source/locales/ui-en.yaml')

let attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
]

function getRulesMissingTranslations() {
	let currentExternalization = yaml.parse(
		readFileSync(rulesTranslationPath, 'utf-8')
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
			[dottedName]: mergeAll(
				toPairs(rule)
					.filter(([, v]) => !!v)
					.map(([k, v]) => {
						let attrToTranslate = attributesToTranslate.find(equals(k))
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
	resolved = mergeAll(resolved)
	return [missingTranslations, resolved]
}

const getUiMissingTranslations = () => {
	const staticKeys = JSON.parse(
		readFileSync(resolve('source/locales/static-analysis-fr.json'), 'utf-8')
	)
	const translatedKeys = yaml.parse(readFileSync(UiTranslationPath, 'utf-8'))

	const missingTranslations = Object.keys(staticKeys).filter((key) => {
		if (key.match(/^\{.*\}$/)) {
			return false
		}
		const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
		return !_path(keys, translatedKeys)
	}, staticKeys)
	return pick(missingTranslations, staticKeys)
}

const fetchTranslation = async (text) => {
	console.log(`Fetch translation for:\n\t${text}`)
	const response = await fetch(
		`https://api.deepl.com/v2/translate?${stringify({
			text,
			auth_key: process.env.DEEPL_API_SECRET,
			tag_handling: 'xml',
			source_lang: 'FR',
			target_lang: 'EN',
		})}`
	)
	const { translations } = await response.json()
	return translations[0].text
}
export {
	fetchTranslation,
	getRulesMissingTranslations,
	getUiMissingTranslations,
	rulesTranslationPath,
	UiTranslationPath,
}
