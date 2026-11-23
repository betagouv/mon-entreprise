import { pipe } from 'effect'
import * as O from 'effect/Option'

import { Montant } from '@/domaine/Montant'
import { eurosParAn } from '@/domaine/MontantRecurrent'
import {
	encodeSituationSérialisée,
	parseSituationSérialisée,
} from '@/utils/URLs'

import {
	initialSituationFrontalierSuisse,
	SituationFrontalierSuisse,
} from './situation'

type SituationSérialisée = {
	dateAffiliation?: string
	dateFinAffiliation?: string
	salaires?: number
	autresRevenus?: number
}

export const encodeSituation = (
	situation: SituationFrontalierSuisse
): string => {
	const sérialisée: SituationSérialisée = {
		dateAffiliation: pipe(
			situation.dateAffiliation,
			O.map(formatDate),
			O.getOrUndefined
		),
		dateFinAffiliation: pipe(
			situation.dateFinAffiliation,
			O.map(formatDate),
			O.getOrUndefined
		),
		salaires: pipe(
			situation.salaires,
			O.map((montant) => montant.valeur),
			O.getOrUndefined
		),
		autresRevenus: pipe(
			situation.autresRevenus,
			O.map((montant) => montant.valeur),
			O.getOrUndefined
		),
	}

	return encodeSituationSérialisée(sérialisée)
}

export const decodeSituation = (chaîne: string): SituationFrontalierSuisse => {
	const sérialisée = parseSituationSérialisée<SituationSérialisée>(chaîne)

	return {
		...initialSituationFrontalierSuisse,
		dateAffiliation: parseDate(sérialisée.dateAffiliation),
		dateFinAffiliation: parseDate(sérialisée.dateFinAffiliation),
		salaires: parseMontant(sérialisée.salaires),
		autresRevenus: parseMontant(sérialisée.autresRevenus),
	}
}

const formatDate = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		'0'
	)}-${String(date.getDate()).padStart(2, '0')}`

const parseDate = (valeur: unknown): O.Option<Date> => {
	if (typeof valeur !== 'string') {
		return O.none()
	}
	const composantes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur)
	if (!composantes) {
		return O.none()
	}
	const date = new Date(
		Number(composantes[1]),
		Number(composantes[2]) - 1,
		Number(composantes[3])
	)

	return isNaN(date.getTime()) ? O.none() : O.some(date)
}

const parseMontant = (valeur: unknown): O.Option<Montant<'€/an'>> =>
	typeof valeur === 'number' && Number.isFinite(valeur) && valeur >= 0
		? O.some(eurosParAn(valeur))
		: O.none()
