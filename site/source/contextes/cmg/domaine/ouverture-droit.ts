import {
	addMonths,
	addYears,
	getMonth,
	getYear,
	startOfMonth,
} from 'date-fns/fp'
import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import {
	enfantAPlusDe3Ans,
	enfantOuvreDroitAuCMG,
	EnfantValide,
	getEnfantFromPrénom,
} from './enfant'
import {
	estSituationCMGValide,
	SituationCMG,
	SituationCMGValide,
} from './situation'

export interface OuvertureDroit {
	enfant: EnfantValide
	dateDeFin: Date
}

export const enfantsGardésOuvrantDroitAuCMG = (
	situation: SituationCMG
): OuvertureDroit[] => {
	if (!estSituationCMGValide(situation)) {
		return []
	}

	return pipe(
		A.isNonEmptyArray(situation.salariées.GED)
			? // Si GED : enfants **à charge** ouvrant droit
			  A.filter(situation.enfantsÀCharge.enfants, enfantOuvreDroitAuCMG)
			: [],
		A.appendAll(
			// Si AMA : enfants **gardés** ouvrant droit
			A.filter(enfantsGardésEnAMA(situation), enfantOuvreDroitAuCMG)
		),
		A.dedupe,
		A.map((enfant) => ({
			enfant,
			dateDeFin: dateDeFinDeDroit(enfant),
		}))
	)
}

const enfantsGardésEnAMA = (situation: SituationCMGValide): EnfantValide[] =>
	pipe(
		situation.salariées.AMA,
		A.flatMap((s) => R.values(s)),
		A.getSomes,
		A.map((d) => d.enfantsGardés),
		A.flatten,
		A.dedupe,
		A.map(getEnfantFromPrénom(situation.enfantsÀCharge.enfants)),
		A.getSomes
	)

// À cause de problèmes de fuseaux horaires, on construit manuellement les dates
// à partir du mois et de l'année
const dateDeFinDeDroit = (enfant: EnfantValide) => {
	if (enfantAPlusDe3Ans(O.some(enfant))) {
		// Pour les enfants nés entre 2019 et 2021,
		// date de fin = 1er jour du mois suivant les 6 ans
		const date6Ans = pipe(
			enfant.dateDeNaissance.value,
			addYears(6),
			addMonths(1),
			startOfMonth
		)
		const year = getYear(date6Ans)
		const month = String(getMonth(date6Ans) + 1).padStart(2, '0')

		return new Date(`${year}-${month}-01`)
	}

	// Pour les enfants nés entre 2023 et 2025,
	// date de fin = 1er septembre de l'année des 3 ans
	const year = pipe(enfant.dateDeNaissance.value, addYears(3), getYear)

	return new Date(`${year}-09-01`)
}
