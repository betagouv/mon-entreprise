import type { AvailableLang } from './langue'
import enTranslationsRaw from './ui-en.yaml'
import { unitsResources } from './units'

const enTranslations = enTranslationsRaw as Record<string, string>

export const baseI18nConfig = (langue: AvailableLang) => {
	const units = unitsResources()

	return {
		lng: langue,
		fallbackLng: 'fr' as const,
		returnNull: false as const,
		resources: {
			fr: units.fr,
			en: { ...units.en, translation: enTranslations },
		},
	}
}
