import 'dotenv/config.js'
import { readFileSync } from 'fs'
import 'isomorphic-fetch'
import yaml from 'yaml'
import rules from '../../../modele-social/dist/index.js'

const localesPath = new URL('../../source/locales/', import.meta.url).pathname
export let UiStaticAnalysisPath = localesPath + 'static-analysis-fr.json'
export let rulesTranslationPath = localesPath + 'rules-en.yaml'
export let UiTranslationPath = localesPath + 'ui-en.yaml'
export let UiOriginalTranslationPath = localesPath + 'ui-fr.yaml'

let attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
]

export function getRulesMissingTranslations() {
	let currentExternalization = yaml.parse(
		readFileSync(rulesTranslationPath, 'utf-8')
	)

	let missingTranslations = []
	let resolved = Object.fromEntries(
		Object.entries(rules)
			.map(([dottedName, rule]) => [
				dottedName,
				!rule || !rule.titre // && utils.ruleWithDedicatedDocumentationPage(rule))
					? { ...rule, titre: dottedName.split(' . ').slice(-1)[0] }
					: rule,
			])
			.map(([dottedName, rule]) => [
				dottedName,
				Object.fromEntries(
					Object.entries(rule)
						.filter(([, v]) => !!v)
						.map(([k, v]) => {
							let attrToTranslate = attributesToTranslate.find(
								(attr) => attr === k
							)
							if (!attrToTranslate) return []
							let enTrad = attrToTranslate + '.en'
							let frTrad = attrToTranslate + '.fr'

							let currentTranslation = currentExternalization[dottedName]

							if ('suggestions' === attrToTranslate) {
								return Object.keys(v).reduce((acc, suggestion) => {
									const enTrad = `suggestions.${suggestion}.en`
									const frTrad = `suggestions.${suggestion}.fr`
									if (
										currentTranslation?.[enTrad] &&
										currentTranslation?.[frTrad] === suggestion
									) {
										return [
											...acc,
											[frTrad, currentTranslation[frTrad]],
											[enTrad, currentTranslation[enTrad]],
										]
									}
									missingTranslations.push([dottedName, enTrad, suggestion])
									return [...acc, [frTrad, suggestion]]
								}, [])
							}

							// Check if a human traduction exists already for this attribute and if
							// it does need to be updated
							if (
								currentTranslation &&
								currentTranslation[enTrad] &&
								currentTranslation[frTrad] === v
							)
								return [
									[enTrad, currentTranslation[enTrad]],
									[frTrad, v],
								]
							missingTranslations.push([dottedName, enTrad, v])
							return [[frTrad, v]]
						})
						.flat()
				),
			])
	)
	return [missingTranslations, resolved]
}

export const getUiMissingTranslations = () => {
	const staticKeys = JSON.parse(readFileSync(UiStaticAnalysisPath, 'utf-8'))
	const translatedKeys = yaml.parse(readFileSync(UiTranslationPath, 'utf-8'))
	const originalKeys = yaml.parse(
		readFileSync(UiOriginalTranslationPath, 'utf-8')
	)

	const missingTranslations = Object.entries(staticKeys)
		.filter(([key, valueInSource]) => {
			if (
				key.match(/^\{.*\}$/) ||
				valueInSource === 'NO_TRANSLATION' ||
				key.includes('NO_AUTO_TRANSLATION')
			) {
				return false
			}
			const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
			const pathReducer = (currentSelection, subPath) =>
				currentSelection?.[subPath]
			const isNewKey = !keys.reduce(pathReducer, translatedKeys)
			const isInvalidatedKey =
				keys.reduce(pathReducer, originalKeys) !== valueInSource

			return isNewKey || isInvalidatedKey
		}, staticKeys)
		.map(([key]) => key)

	return Object.fromEntries(
		Object.entries(staticKeys).filter(([key]) =>
			missingTranslations.includes(key)
		)
	)
}

export const fetchTranslation = async (text) => {
	const response = await fetch(
		`https://api.deepl.com/v2/translate?${new URLSearchParams({
			text,
			auth_key: process.env.DEEPL_API_SECRET,
			tag_handling: 'xml',
			source_lang: 'FR',
			target_lang: 'EN',
		}).toString()}`
	)
	if (response.status !== 200) {
		console.error(`❌ Deepl return status ${response.status} for:\n\t${text}\n`)
		return ''
	}
	try {
		const { translations } = await response.json()
		console.log(`✅ Deepl translation succeeded for:\n\t${text}\n`)
		return translations[0].text
	} catch (e) {
		console.warn(`❌ Deepl translation failed for:\n\t${text}\n`)
		return ''
	}
}
