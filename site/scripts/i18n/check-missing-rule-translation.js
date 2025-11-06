import { getRulesMissingTranslations } from './utils.js'

const [fileName, missingTranslations] = getRulesMissingTranslations()[0]

const getErrorMessage = (fileName, missingTranslations) => {
	const listOfMissingTranslations = missingTranslations
		.map(([dottedName, attr]) => `\t- ${dottedName} [${attr}]\n`)
		.join('')

	return `Les traductions suivantes sont à corriger dans '${fileName}' : \n
		${listOfMissingTranslations}\n
		Utilisez la commande suivante pour traduire automatiquement les clés manquantes :
		\n\n\tyarn run i18n:rules:translate\n`
}

if (missingTranslations.length) {
	throw new Error(getErrorMessage(fileName, missingTranslations))
}
