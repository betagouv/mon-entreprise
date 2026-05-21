import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './.generated/ui-en.json'
import unitsTranslations from './.generated/units.json'

const langue = process.env.LANGUE === 'en' ? 'en' : 'fr'

i18next
	.use(initReactI18next)
	.init({
		lng: langue,
		fallbackLng: 'fr',
		returnNull: false,
		resources: {
			fr: { units: unitsTranslations.fr },
			en: { translation: enTranslations, units: unitsTranslations.en },
		},
		react: {
			useSuspense: false,
		},
	})
	.catch((err) =>
		// eslint-disable-next-line no-console
		console.error('Erreur init i18next client:', err)
	)

export default i18next
