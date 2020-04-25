var { stringify } = require('yaml')
var fs = require('fs')

const {
	getRulesMissingTranslations,
	rulesTranslationPath,
	fetchTranslation
} = require('./utils')

const [missingTranslations, resolved] = getRulesMissingTranslations()

fs.writeFileSync(
	rulesTranslationPath,
	stringify(resolved, { sortMapEntries: true })
)

missingTranslations.forEach(async ([dottedName, attr, value]) => {
	try {
		const translation = await fetchTranslation(value)
		resolved[dottedName][attr] = '[automatic] ' + translation
		// C'est très bourrin, mais on ne veut pas perdre une traduction qu'on a payé
		fs.writeFileSync(
			rulesTranslationPath,
			stringify(resolved, { sortMapEntries: true })
		)
	} catch (e) {
		console.log(e)
	}
})
