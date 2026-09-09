import { getRulesMissingTranslations } from './utils.js'

const missingTranslations = getRulesMissingTranslations()[0]

if (missingTranslations.length) {
	throw new Error(
		`Les traductions suivantes sont à corriger dans 'rules-en.yaml' : \n${missingTranslations
			.map(([dottedName, attr]) => `\t- ${dottedName} [${attr}]\n`)
			.join(
				''
			)}\nUtilisez la commande suivante pour traduire automatiquement les clés manquantes :\n\n\tyarn run i18n:rules:translate\n`
	)
}
