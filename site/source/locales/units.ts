import type { AvailableLang } from './langue'
import unitsTranslationsRaw from './units.yaml'

type Units = Record<AvailableLang, Record<string, string>>

const unitsTranslations = unitsTranslationsRaw as Units

const frenchUnitsTranslations = Object.entries(unitsTranslations.fr)

export const unitsResources = (): Record<
	AvailableLang,
	{ units: Record<string, string> }
> => ({
	fr: { units: unitsTranslations.fr },
	en: { units: unitsTranslations.en },
})

export const getUnitKey = (unit: string): string => {
	const key = frenchUnitsTranslations
		.find(([, translation]) => translation === unit)?.[0]
		.replace(/_plural$/, '')

	return key || unit
}
