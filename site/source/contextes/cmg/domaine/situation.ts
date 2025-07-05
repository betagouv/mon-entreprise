import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

import { EnfantsÀCharge, estEnfantsÀChargeValide } from './enfant'
import { estSalariéesValide, SalariéeAMA, SalariéeGED } from './salariée'

export interface SituationCMG<PrénomsEnfants extends string = string>
	extends Situation {
	aPerçuCMG: O.Option<boolean>
	plusDe2MoisDeDéclaration: O.Option<boolean>
	parentIsolé: O.Option<boolean>
	ressources: O.Option<M.Montant<'€/an'>>
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	salariées: {
		GED: Array<SalariéeGED>
		AMA: Array<SalariéeAMA<PrénomsEnfants>>
	}
}

export interface SituationCMGValide extends SituationCMG {
	aPerçuCMG: O.Some<boolean>
	plusDe2MoisDeDéclaration: O.Some<boolean>
	parentIsolé: O.Some<boolean>
	ressources: O.Some<M.Montant<'€/an'>>
}

export const estSituationCMGValide = (
	situation: SituationCMG
): situation is SituationCMGValide =>
	estInformationsValides(situation) &&
	estEnfantsÀChargeValide(situation.enfantsÀCharge) &&
	estSalariéesValide(situation.salariées)

export const initialSituationCMG: SituationCMG = {
	_tag: 'Situation',
	aPerçuCMG: O.none(),
	plusDe2MoisDeDéclaration: O.none(),
	parentIsolé: O.none(),
	ressources: O.none(),
	enfantsÀCharge: {
		enfants: [],
		perçoitAeeH: O.none(),
		AeeH: O.none(),
	},
	salariées: {
		GED: [],
		AMA: [],
	},
}

export const estInformationsValides = (situation: SituationCMG): boolean =>
	O.isSome(situation.aPerçuCMG) &&
	O.isSome(situation.plusDe2MoisDeDéclaration) &&
	O.isSome(situation.parentIsolé) &&
	O.isSome(situation.ressources)
