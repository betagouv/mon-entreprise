var { safeDump } = require('js-yaml')
var fs = require('fs')

const {
	getRulesMissingTranslations,
	rulesTranslationPath,
	fetchTranslation
} = require('./utils')

const [missingTranslations, resolved] = getRulesMissingTranslations()

fs.writeFileSync(rulesTranslationPath, safeDump(resolved))

missingTranslations.forEach(async ([dottedName, attr, value]) => {
	try {
		const translation = await fetchTranslation(value)
		resolved[dottedName][attr] = '[automatic] ' + translation
		// C'est très bourrin, mais on ne veut pas perdre une traduction qu'on a payé
		fs.writeFileSync(rulesTranslationPath, safeDump(resolved))
	} catch (e) {
		console.log(e)
	}
})
