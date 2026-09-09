import { readFileSync, writeFileSync } from 'fs'

import yaml from 'yaml'

import {
	assocPath,
	fetchTranslation,
	filterUnusedTranslations,
	getUiMissingTranslations,
	UiOriginalTranslationPath,
	UiTranslationPath,
} from './utils.js'

const sleep = (timeout) =>
	new Promise((resolve) => setTimeout(resolve, timeout))

const missingTranslations = getUiMissingTranslations()
let originalKeys = yaml.parse(readFileSync(UiOriginalTranslationPath, 'utf-8'))
let translatedKeys = yaml.parse(readFileSync(UiTranslationPath, 'utf-8'))
await Promise.all(
	Object.entries(missingTranslations)
		.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
		.map(async ([key, originalTranslation], i) => {
			try {
				await sleep(i * 50)
				const translation = await fetchTranslation(originalTranslation)
				const path = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
				translatedKeys = assocPath(path, translation, translatedKeys)
				originalKeys = assocPath(path, originalTranslation, originalKeys)
			} catch (e) {
				console.error(e)
				console.log(originalTranslation)
			}
		})
)

const { originalTranslations, translatedTranslations } =
	filterUnusedTranslations(originalKeys, translatedKeys)

writeFileSync(
	UiTranslationPath,
	yaml.stringify(translatedTranslations, { sortMapEntries: true })
)
writeFileSync(
	UiOriginalTranslationPath,
	yaml.stringify(originalTranslations, { sortMapEntries: true })
)
