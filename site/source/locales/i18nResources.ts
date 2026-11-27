import type { AvailableLang } from './langue'
import { unitsResources } from './units'

export type TranslationCatalog = Record<string, string>

export const baseI18nConfig = (
	langue: AvailableLang,
	catalog?: TranslationCatalog
) => {
	const units = unitsResources()

	return {
		lng: langue,
		fallbackLng: 'fr' as const,
		returnNull: false as const,
		resources: {
			fr: units.fr,
			en: catalog ? { ...units.en, translation: catalog } : units.en,
		},
	}
}
