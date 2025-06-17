import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'

import {
	enfantOuvreDroitAuCMG,
	EnfantValide,
	getEnfantFromPrénom,
} from './enfant'
import {
	estSituationCMGValide,
	SituationCMG,
	SituationCMGValide,
} from './situation'

export const enfantsGardésOuvrantDroitAuCMG = (
	situation: SituationCMG
): EnfantValide[] => {
	const enfantsOuvrantDroit: EnfantValide[] = []

	if (!estSituationCMGValide(situation)) {
		return enfantsOuvrantDroit
	}

	// Si GED : enfants **à charge** ouvrant droit
	if (A.isNonEmptyArray(situation.salariées.GED)) {
		enfantsOuvrantDroit.push(
			...A.filter(situation.enfantsÀCharge.enfants, enfantOuvreDroitAuCMG)
		)
	}
	// Si AMA : enfants **gardés** ouvrant droit
	if (A.isNonEmptyArray(situation.salariées.AMA)) {
		enfantsOuvrantDroit.push(
			...A.filter(enfantsGardésEnAMA(situation), enfantOuvreDroitAuCMG)
		)
	}

	return A.dedupe(enfantsOuvrantDroit)
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
