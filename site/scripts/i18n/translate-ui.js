import { readFileSync, writeFileSync } from 'fs'
import yaml from 'yaml'

import {
	UiOriginalTranslationPath,
	UiTranslationPath,
	fetchTranslation,
	getUiMissingTranslations,
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
writeFileSync(
	UiTranslationPath,
	yaml.stringify(translatedKeys, { sortMapEntries: true })
)
writeFileSync(
	UiOriginalTranslationPath,
	yaml.stringify(originalKeys, { sortMapEntries: true })
)

function assocPath(path, val, obj) {
	if (path.length === 0) return val

	const key = path[0]

	if (path.length >= 2) {
		val = assocPath(path.slice(1), val, obj?.[key] ?? {})
	}

	return { ...obj, [key]: val }
}
