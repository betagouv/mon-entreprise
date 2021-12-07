import { getUiMissingTranslations } from './utils.js'

const missingTranslationKeys = Object.keys(getUiMissingTranslations())
if (missingTranslationKeys.length) {
	throw new Error(`Il manque des traductions UI pour les clés suivantes : ${[
		'',
		...missingTranslationKeys,
	].join('\n\t- ')}
Utilisez la commande suivante pour traduire automatiquement les clés manquantes :

\tyarn run i18n:ui:translate
`)
}
