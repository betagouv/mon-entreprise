import { writeFileSync } from 'fs'
import { stringify } from 'yaml'
import prettier from 'prettier'
import {
	getRulesMissingTranslations,
	rulesTranslationPath,
	fetchTranslation,
} from './utils.js'

const [missingTranslations, resolved] = getRulesMissingTranslations()

writeFileSync(
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

	prettier.resolveConfig(rulesTranslationPath).then((options) => {
		const formattedYaml = prettier.format(
			stringify(resolved, { sortMapEntries: true }),
			{
				...options,
				parser: 'yaml',
			}
		)
		writeFileSync(rulesTranslationPath, formattedYaml)
	})
})()
