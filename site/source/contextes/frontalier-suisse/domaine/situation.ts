import * as O from 'effect/Option'

import { Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

export interface SituationFrontalierSuisse extends Situation {
	_type: 'frontalier-suisse'
	dateAffiliation: O.Option<Date>
	salaires: O.Option<Montant<'€/an'>>
	autresRevenus: O.Option<Montant<'€/an'>>
}

export interface SituationFrontalierSuisseValide
	extends SituationFrontalierSuisse {
	dateAffiliation: O.Some<Date>
	salaires: O.Some<Montant<'€/an'>>
}

export const initialSituationFrontalierSuisse: SituationFrontalierSuisse = {
	_tag: 'Situation',
	_type: 'frontalier-suisse',
	dateAffiliation: O.none(),
	salaires: O.none(),
	autresRevenus: O.none(),
}

export const situationEstCommencée = (
	situation: SituationFrontalierSuisse
): boolean =>
	O.isSome(situation.dateAffiliation) || O.isSome(situation.salaires)

export const estSituationValide = (
	situation: SituationFrontalierSuisse
): situation is SituationFrontalierSuisseValide =>
	O.isSome(situation.dateAffiliation) && O.isSome(situation.salaires)
