export const UNITÉS_MONÉTAIRES = ['€', '€/an', '€/mois', '€/jour', '€/heure']

export type UnitéMonétaire = (typeof UNITÉS_MONÉTAIRES)[number]

export const isUnitéMonétaire = (unité?: string): unité is UnitéMonétaire =>
	UNITÉS_MONÉTAIRES.includes(unité as UnitéMonétaire)

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
