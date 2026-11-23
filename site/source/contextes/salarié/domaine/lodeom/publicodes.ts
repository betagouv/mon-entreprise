export const lodeomDottedName =
	'salarié . cotisations . exonérations . lodeom . montant'

export const rémunérationBruteDottedName = 'salarié . rémunération . brut'

export const heuresSupplémentairesDottedName =
	'salarié . temps de travail . heures supplémentaires'
export const heuresComplémentairesDottedName =
	'salarié . temps de travail . heures complémentaires'

export const getDateForContexte = (
	year: number,
	monthIndex: number = 0
): string => new Date(year, monthIndex).toLocaleDateString('fr')
