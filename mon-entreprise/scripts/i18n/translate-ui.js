var { stringify, parse } = require('yaml')
var R = require('ramda')
var fs = require('fs')

const {
	getUiMissingTranslations,
	UiTranslationPath,
	UiOriginalTranslationPath,
	fetchTranslation,
} = require('./utils')

;(async function () {
	const missingTranslations = getUiMissingTranslations()
	let originalKeys = parse(fs.readFileSync(UiOriginalTranslationPath, 'utf-8'))
	let translatedKeys = parse(fs.readFileSync(UiTranslationPath, 'utf-8'))
	await Promise.all(
		Object.entries(missingTranslations)
			.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
			.map(async ([key, originalTranslation]) => {
				try {
					const translation = await fetchTranslation(originalTranslation)
					const path = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
					translatedKeys = R.assocPath(path, translation, translatedKeys)
					originalKeys = R.assocPath(path, originalTranslation, originalKeys)
				} catch (e) {
					console.log(e)
				}
			})
	)
	fs.writeFileSync(
		UiTranslationPath,
		stringify(translatedKeys, { sortMapEntries: true })
	)
	fs.writeFileSync(
		UiOriginalTranslationPath,
		stringify(originalKeys, { sortMapEntries: true })
	)
})()
