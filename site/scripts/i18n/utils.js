import { readFileSync } from 'fs'

import dotenv from 'dotenv'
import yaml from 'yaml'

import rules from '../../../modele-social/dist/index.js'

dotenv.config()

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

const recursiveRulesMissingTranslations = (currentExternalization, rules) => {
	const ret = { missingTranslations: [], resolved: {} }

	ret.resolved = Object.fromEntries(
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
							let currentTranslation = currentExternalization?.[dottedName]

							if ('avec' === k) {
								const result = recursiveRulesMissingTranslations(
									currentTranslation?.avec,
									v
								)
								ret.missingTranslations.push([
									dottedName,
									'avec',
									result.missingTranslations,
								])

								return [['avec', result.resolved]]
							}

							let attrToTranslate = attributesToTranslate.find(
								(attr) => attr === k
							)
							if (!attrToTranslate) return []
							let enTrad = attrToTranslate + '.en'
							let frTrad = attrToTranslate + '.fr'

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
									ret.missingTranslations.push([dottedName, enTrad, suggestion])
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
							ret.missingTranslations.push([dottedName, enTrad, v])
							return [[frTrad, v]]
						})
						.flat()
				),
			])
	)

	return ret
}

export function getRulesMissingTranslations() {
	let currentExternalization = yaml.parse(
		readFileSync(rulesTranslationPath, 'utf-8')
	)

	const { missingTranslations, resolved } = recursiveRulesMissingTranslations(
		currentExternalization,
		rules
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
			if (key.match(/^\{.*\}$/) || key.includes('NO_AUTO_TRANSLATION')) {
				return false
			}
			const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
			const pathReducer = (currentSelection, subPath) =>
				currentSelection?.[subPath]
			const isNewKey = !keys.reduce(pathReducer, translatedKeys)
			const isInvalidatedKey =
				keys.reduce(pathReducer, originalKeys) !==
				(valueInSource === 'NO_TRANSLATION' ? key : valueInSource)

			return isNewKey || isInvalidatedKey
		}, staticKeys)
		.map(([key]) => key)

	return Object.fromEntries(
		Object.entries(staticKeys).filter(([key]) =>
			missingTranslations.includes(key)
		)
	)
}

const getInObject = (keys, object) =>
	keys.reduce((obj, key) => (obj && key in obj ? obj[key] : undefined), object)

export function assocPath(path, val, obj) {
	if (path.length === 0) return val

	const key = path[0]

	if (path.length >= 2) {
		val = assocPath(path.slice(1), val, obj?.[key] ?? {})
	}

	return { ...obj, [key]: val }
}

export const filterUnusedTranslations = (original, translated) => {
	const staticKeys = JSON.parse(readFileSync(UiStaticAnalysisPath, 'utf-8'))

	const ret = Object.keys(staticKeys).reduce(
		(obj, key) => {
			const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)

			obj.originalTranslations = assocPath(
				keys,
				getInObject(keys, original),
				obj.originalTranslations
			)
			obj.translatedTranslations = assocPath(
				keys,
				getInObject(keys, translated),
				obj.translatedTranslations
			)

			return obj
		},
		{ originalTranslations: {}, translatedTranslations: {} }
	)

	return ret
}

export const fetchTranslation = async (text) => {
	if (typeof text !== 'string') {
		throw new Error("❌ Can't translate anything other than a string")
	}
	const response = await fetch(`https://api.deepl.com/v2/translate`, {
		method: 'POST',
		headers: {
			Authorization: 'DeepL-Auth-Key ' + process.env.DEEPL_API_SECRET,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			text: text
				.replace(/> /g, '<quote>> </quote>')
				.replace(/{{/g, '<var>')
				.replace(/}}/g, '</var>'),
			tag_handling: 'xml',
			ignore_tags: 'var,quote',
			source_lang: 'FR',
			target_lang: 'EN',
		}),
	})
	if (response.status !== 200) {
		const msg = JSON.stringify(text, null, 2)
		console.error(`❌ Deepl return status ${response.status} for:\n\t${msg}\n`)
		return ''
	}
	try {
		const { translations } = await response.json()
		const translation = translations[0].text
			.replace(/<var>/g, '{{')
			.replace(/<\/var>/g, '}}')
			.replace(/<quote>> <\/quote>/g, '> ')
		console.log(
			`✅ Deepl translation succeeded for:\n\t${text}\n\t${translation}\n`
		)
		return translation
	} catch (e) {
		console.warn(`❌ Deepl translation failed for:\n\t${text}\n`)
		return ''
	}
}
