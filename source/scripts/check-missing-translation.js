const { getMissingTranslations } = require('./get-missing-translations')

const missingTranslations = getMissingTranslations()[0]

if (missingTranslations.length) {
	throw new Error(
		`Il manque les traductions suivantes dans 'externalized.yaml' : \n${missingTranslations
			.map(([dottedName, attr]) => `\t- ${dottedName} [${attr}]\n`)
			.join(
				''
			)}\nUtilisez la commande suivante pour traduire automatiquement les clés manquantes :\n\n\tyarn run i18n:translate-rules\n`
	)
}
