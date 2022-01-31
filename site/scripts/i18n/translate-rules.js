import { writeFileSync } from 'fs'
import prettier from 'prettier'
import yaml from 'yaml'
import {
	fetchTranslation,
	getRulesMissingTranslations,
	rulesTranslationPath,
} from './utils.js'

const [missingTranslations, resolved] = getRulesMissingTranslations()

writeFileSync(
	rulesTranslationPath,
	yaml.stringify(resolved, { sortMapEntries: true })
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

	prettier.resolveConfig(rulesTranslationPath).then((options) => {
		const formattedYaml = prettier.format(
			yaml.stringify(resolved, { sortMapEntries: true }),
			{
				...options,
				parser: 'yaml',
			}
		)
		writeFileSync(rulesTranslationPath, formattedYaml)
	})
})()
