import { readFileSync, writeFileSync } from 'fs'
import { assocPath } from 'ramda'
import { parse, stringify } from 'yaml'
import {
	fetchTranslation,
	getUiMissingTranslations,
	UiOriginalTranslationPath,
	UiTranslationPath,
} from './utils'
;(async function () {
	const missingTranslations = getUiMissingTranslations()
	let originalKeys = parse(readFileSync(UiOriginalTranslationPath, 'utf-8'))
	let translatedKeys = parse(readFileSync(UiTranslationPath, 'utf-8'))
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
	writeFileSync(
		UiTranslationPath,
		stringify(translatedKeys, { sortMapEntries: true })
	)
	writeFileSync(
		UiOriginalTranslationPath,
		stringify(originalKeys, { sortMapEntries: true })
	)
})()
