var { stringify, parse } = require('yaml')
var R = require('ramda')
var fs = require('fs')

const {
	getUiMissingTranslations,
	UiTranslationPath,
	fetchTranslation,
} = require('./utils')

const missingTranslations = getUiMissingTranslations()

let translatedKeys = parse(fs.readFileSync(UiTranslationPath, 'utf-8'))

Object.entries(missingTranslations)
	.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
	.forEach(async ([key, value]) => {
		try {
			const translation = await fetchTranslation(value)
			translatedKeys = R.assocPath(
				key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/),
				translation,
				translatedKeys
			)
			fs.writeFileSync(
				UiTranslationPath,
				stringify(translatedKeys, { sortMapEntries: true })
			)
		} catch (e) {
			console.log(e)
		}
	})
