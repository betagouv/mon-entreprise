import { stringify, parse } from 'yaml'
import { assocPath } from 'ramda'
import { readFileSync, writeFileSync } from 'fs'

import {
	getUiMissingTranslations,
	UiTranslationPath,
	fetchTranslation,
} from './utils.js'

const missingTranslations = getUiMissingTranslations()

let translatedKeys = parse(readFileSync(UiTranslationPath, 'utf-8'))

Object.entries(missingTranslations)
	.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
	.forEach(async ([key, value]) => {
		try {
			const translation = await fetchTranslation(value)
			translatedKeys = assocPath(
				key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/),
				translation,
				translatedKeys
			)
			writeFileSync(
				UiTranslationPath,
				stringify(translatedKeys, { sortMapEntries: true })
			)
		} catch (e) {
			console.log(e)
		}
	})
