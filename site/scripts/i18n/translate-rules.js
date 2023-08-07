import { writeFileSync } from 'fs'

import prettier from 'prettier'
import yaml from 'yaml'

import {
	fetchTranslation,
	getRulesMissingTranslations,
	rulesTranslationPath,
} from './utils.js'

const [missingTranslations, resolved] = getRulesMissingTranslations()

const translateObject = (paths, arr) =>
	Promise.all(
		arr.map(async ([dot, k, v]) => {
			if (typeof v === 'string') {
				const trad = await fetchTranslation(v)
				const res = paths.reduce((obj, key) => obj[key], resolved)
				res[dot][k] = '[automatic] ' + trad
			} else {
				return await translateObject([...paths, dot, k], v)
			}
		})
	)

await Promise.all(
	missingTranslations.map(async ([dottedName, attr, value]) => {
		try {
			if (attr === 'avec') {
				return await translateObject([dottedName, attr], value)
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
)

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
