import type { AvailableLang } from './langue'
import unitsTranslationsRaw from './units.yaml'

type Units = Record<AvailableLang, Record<string, string>>

const unitsTranslations = unitsTranslationsRaw as Units

export const unitsResources = (): Record<
	AvailableLang,
	{ units: Record<string, string> }
> => ({
	fr: { units: unitsTranslations.fr },
	en: { units: unitsTranslations.en },
})
