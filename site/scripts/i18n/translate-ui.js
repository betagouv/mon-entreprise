import { readFileSync, writeFileSync } from 'fs'
import { assocPath } from 'ramda'
import yaml from 'yaml'
import {
	fetchTranslation,
	filterUnusedTranslations,
	getUiMissingTranslations,
	UiOriginalTranslationPath,
	UiTranslationPath,
} from './utils.js'
;(async function () {
	const missingTranslations = getUiMissingTranslations()
	let originalKeys = yaml.parse(
		readFileSync(UiOriginalTranslationPath, 'utf-8')
	)
	let translatedKeys = yaml.parse(readFileSync(UiTranslationPath, 'utf-8'))
	await Promise.all(
		Object.entries(missingTranslations)
			.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
			.map(async ([key, originalTranslation]) => {
				try {
					const translation = await fetchTranslation(originalTranslation)
					const path = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
					translatedKeys = assocPath(path, translation, translatedKeys)
					originalKeys = assocPath(path, originalTranslation, originalKeys)
				} catch (e) {
					console.log(e)
				}
			})
	)

	const { frTranslations, enTranslations } = filterUnusedTranslations(
		originalKeys,
		translatedKeys
	)
	writeFileSync(
		UiTranslationPath,
		yaml.stringify(enTranslations, { sortMapEntries: true })
	)
	writeFileSync(
		UiOriginalTranslationPath,
		yaml.stringify(frTranslations, { sortMapEntries: true })
	)
})()
