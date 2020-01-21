require('dotenv').config()

var { safeDump } = require('js-yaml')
var fs = require('fs')

var querystring = require('querystring')
require('isomorphic-fetch')
const {
	getMissingTranslations,
	externalizationPath
} = require('./get-missing-translations')

const [missingTranslations, resolved] = getMissingTranslations()

fs.writeFileSync(externalizationPath, safeDump(resolved))

const translateWithDeepl = async text => {
	const response = await fetch(
		`https://api.deepl.com/v2/translate?${querystring.stringify({
			text,
			auth_key: process.env.DEEPL_API_SECRET,
			source_lang: 'FR',
			target_lang: 'EN'
		})}`
	)
	const { translations } = await response.json()
	return translations[0].text
}

missingTranslations.length &&
	console.log(
		`Fetch translation for: \n${missingTranslations
			.map(([dottedName, attr]) => `\t- ${dottedName} [${attr}]\n`)
			.join('')}`
	)
missingTranslations.forEach(async ([dottedName, attr, value]) => {
	try {
		const translation = await translateWithDeepl(value)
		resolved[dottedName][attr] = translation
		// C'est très bourrin, mais on ne veut pas perdre une traduction qu'on a payé
		fs.writeFileSync(externalizationPath, safeDump(resolved))
	} catch (e) {
		console.log(e)
	}
})
