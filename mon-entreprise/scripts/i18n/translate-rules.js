var { stringify } = require('yaml')
var fs = require('fs')
var prettier = require('prettier')

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
	} catch (e) {
		console.log(e)
	}
})

prettier.resolveConfig(rulesTranslationPath).then(options => {
	fs.writeFileSync(
		rulesTranslationPath,
		prettier.format(stringify(resolved, { sortMapEntries: true }), {
			...options,
			parser: 'yaml'
		})
	)
})
