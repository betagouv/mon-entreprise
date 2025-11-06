import { writeFileSync } from 'fs'

import prettier from 'prettier'
import yaml from 'yaml'

import {
	fetchTranslation,
	getRulesMissingTranslations,
	localesPath,
	translateObject,
} from './utils.js'

const missingTranslationsByFile = getRulesMissingTranslations()

await Promise.all(
	missingTranslationsByFile.map(([fileName, missingTranslations, resolved]) => {
		const rulesTranslationPath = localesPath + fileName
		missingTranslations.map(async ([dottedName, attr, value]) => {
			try {
				if (attr === 'avec') {
					return await translateObject(resolved, [dottedName, attr], value)
				}

				if (typeof value === 'string') {
					const translation = await fetchTranslation(value)
					resolved[dottedName][attr] = '[automatic] ' + translation
				} else {
					console.warn(
						"Warning: ⚠️ Can't translate anything other than a string",
						{ dottedName, attr, value }
					)
				}
			} catch (e) {
				console.error(e)
				console.log({ dottedName, attr, value })
			}
		})

		prettier.resolveConfig(rulesTranslationPath).then(async (options) => {
			const formattedYaml = await prettier.format(
				yaml.stringify(resolved, { sortMapEntries: true }),
				{
					...options,
					parser: 'yaml',
				}
			)
			writeFileSync(rulesTranslationPath, formattedYaml)
		})
	})
)
