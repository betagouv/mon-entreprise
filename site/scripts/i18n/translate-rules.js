import { writeFileSync } from 'fs'
import { format, resolveConfig } from 'prettier'
import { stringify } from 'yaml'
import {
	fetchTranslation,
	getRulesMissingTranslations,
	rulesTranslationPath,
} from './utils'

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

	resolveConfig(rulesTranslationPath).then((options) => {
		const formattedYaml = format(
			stringify(resolved, { sortMapEntries: true }),
			{
				...options,
				parser: 'yaml',
			}
		)
		writeFileSync(rulesTranslationPath, formattedYaml)
	})
})()
