export type UnitéMonétairePonctuelle = '€' | '€/titre-restaurant'
export type UnitéMonétaireRécurrente = '€/mois' | '€/trimestre' | '€/an' | '€/jour' | '€/heure'
export type UnitéMonétaire = UnitéMonétairePonctuelle | UnitéMonétaireRécurrente

const UNITÉS_MONÉTAIRES = [
	'€',
	'€/titre-restaurant',
	'€/an',
	'€/trimestre',
	'€/mois',
	'€/jour',
	'€/heure',
] as const

export const isUnitéMonétaire = (unité?: string): unité is UnitéMonétaire =>
	UNITÉS_MONÉTAIRES.includes(unité as UnitéMonétaire)
export const isUnitéMonétaireRécurrente = (
	unité?: string
): unité is UnitéMonétaireRécurrente =>
	isUnitéMonétaire(unité as UnitéMonétaire) &&
	unité !== '€' &&
	unité !== '€/titre-restaurant'

export const UNITÉS_QUANTITÉS = [
	'%',
	'heures/mois',
	'heures/semaine',
	'jours',
	'jours ouvrés',
	'mois',
	'trimestre civil',
	'année civile',
	'employés',
	'titre-restaurant/mois',
] as const

export type UnitéQuantité = (typeof UNITÉS_QUANTITÉS)[number]

export const isUnitéQuantité = (unité?: string): unité is UnitéQuantité =>
	UNITÉS_QUANTITÉS.includes(unité as UnitéQuantité)
