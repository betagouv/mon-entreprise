export type UnitéMonétairePonctuelle = '€'
export type UnitéMonétaireRécurrente = '€/mois' | '€/an' | '€/jour' | '€/heure'
export type UnitéMonétaire = UnitéMonétairePonctuelle | UnitéMonétaireRécurrente

export const UNITÉS_MONÉTAIRES = ['€', '€/an', '€/mois', '€/jour', '€/heure']

export const isUnitéMonétaire = (unité?: string): unité is UnitéMonétaire =>
	UNITÉS_MONÉTAIRES.includes(unité as UnitéMonétaire)
export const isUnitéMonétaireRécurrente = (
	unité?: string
): unité is UnitéMonétaireRécurrente =>
	isUnitéMonétaire(unité as UnitéMonétaire) && unité !== '€'

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
]

export type UnitéQuantité = (typeof UNITÉS_QUANTITÉS)[number]

export const isUnitéQuantité = (unité?: string): unité is UnitéQuantité =>
	UNITÉS_QUANTITÉS.includes(unité as UnitéQuantité)
