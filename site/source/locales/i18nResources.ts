import enTranslations from './.generated/ui-en.json'
import unitsTranslations from './.generated/units.json'

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const
export type AvailableLang = (typeof SUPPORTED_LANGUAGES)[number]

export const parseLangue = (raw: string | undefined): AvailableLang => {
	const value = raw ?? 'fr'
	if (!SUPPORTED_LANGUAGES.includes(value as AvailableLang)) {
		throw new Error(
			`LANGUE invalide : "${value}". Valeurs supportées : ${SUPPORTED_LANGUAGES.join(
				', '
			)}.`
		)
	}

	return value as AvailableLang
}

export const baseI18nConfig = (langue: AvailableLang) => ({
	lng: langue,
	fallbackLng: 'fr' as const,
	returnNull: false as const,
	resources: {
		fr: { units: unitsTranslations.fr },
		en: { translation: enTranslations, units: unitsTranslations.en },
	},
})
