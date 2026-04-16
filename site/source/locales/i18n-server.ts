import 'server-only'

import i18next from 'i18next'

import enTranslations from './.generated/ui-en.json'
import unitsTranslations from './.generated/units.json'

const langue = (process.env.LANGUE ?? 'fr') as 'fr' | 'en'

// Init synchrone : toutes les resources sont fournies inline (pas de backend),
// donc i18next.t() est utilisable dès le retour de cet appel.
i18next
	.init({
		lng: langue,
		fallbackLng: 'fr',
		returnNull: false,
		resources: {
			fr: { units: unitsTranslations.fr },
			en: { translation: enTranslations, units: unitsTranslations.en },
		},
	})
	// eslint-disable-next-line no-console
	.catch((err) => console.error('Erreur init i18next server:', err))

export default i18next
