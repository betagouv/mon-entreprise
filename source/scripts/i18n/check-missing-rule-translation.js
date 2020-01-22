const { getRulesMissingTranslations } = require('./utils')

const missingTranslations = getRulesMissingTranslations()[0]

if (missingTranslations.length) {
	throw new Error(
		`Il manque les traductions suivantes dans 'externalized.yaml' : \n${missingTranslations
			.map(([dottedName, attr]) => `\t- ${dottedName} [${attr}]\n`)
			.join(
				''
			)}\nUtilisez la commande suivante pour traduire automatiquement les clés manquantes :\n\n\tyarn run i18n:rules:translate\n`
	)
}
