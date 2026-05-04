import 'server-only'

import i18next from 'i18next'

import enTranslations from './.generated/ui-en.json'
import unitsTranslations from './.generated/units.json'

const SUPPORTED_LANGUAGES = ['fr', 'en'] as const
type AvailableLang = (typeof SUPPORTED_LANGUAGES)[number]

const rawLangue = process.env.LANGUE ?? 'fr'
if (!SUPPORTED_LANGUAGES.includes(rawLangue as AvailableLang)) {
	throw new Error(
		`LANGUE invalide : "${rawLangue}". Valeurs supportées : ${SUPPORTED_LANGUAGES.join(
			', '
		)}.`
	)
}

export const langue = rawLangue as AvailableLang

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
