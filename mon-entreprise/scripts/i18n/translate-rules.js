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
;(async function main() {
	await Promise.all(
		missingTranslations.map(async ([dottedName, attr, value]) => {
			try {
				const translation = await fetchTranslation(value)
				resolved[dottedName][attr] = '[automatic] ' + translation
			} catch (e) {
				console.log(e)
			}
		})
	)

	prettier.resolveConfig(rulesTranslationPath).then(options => {
		const formattedYaml = prettier.format(
			stringify(resolved, { sortMapEntries: true }),
			{
				...options,
				parser: 'yaml'
			}
		)
		fs.writeFileSync(rulesTranslationPath, formattedYaml)
	})
})()
