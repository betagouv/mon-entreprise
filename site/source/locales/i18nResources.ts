import { AvailableLang } from './langue'
import enTranslationsRaw from './ui-en.yaml'
import unitsTranslationsRaw from './units.yaml'

interface Units {
	fr: Record<string, string>
	en: Record<string, string>
}

const enTranslations = enTranslationsRaw as Record<string, string>
const unitsTranslations = unitsTranslationsRaw as Units

export const baseI18nConfig = (langue: AvailableLang) => ({
	lng: langue,
	fallbackLng: 'fr' as const,
	returnNull: false as const,
	resources: {
		fr: { units: unitsTranslations.fr },
		en: { translation: enTranslations, units: unitsTranslations.en },
	},
})
