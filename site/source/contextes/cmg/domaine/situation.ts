import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

import { DéclarationDeGarde } from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'

export interface MoisHistorique<PrénomsEnfants extends string = string> {
	déclarationsDeGarde: Array<DéclarationDeGarde<PrénomsEnfants>>
}

export interface SituationCMG<PrénomsEnfants extends string = string>
	extends Situation {
	ressources: O.Option<M.Montant<'EuroParAn'>>
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	historique: {
		mars: MoisHistorique<PrénomsEnfants>
		avril: MoisHistorique<PrénomsEnfants>
		mai: MoisHistorique<PrénomsEnfants>
	}
}

export interface SituationCMGValide extends SituationCMG {
	ressources: O.Some<M.Montant<'EuroParAn'>>
}

export const initialSituationCMG: SituationCMG = {
	_tag: 'Situation',
	ressources: O.none(),
	enfantsÀCharge: {
		enfants: {},
		AeeH: O.none(),
	},
	historique: {
		mars: { déclarationsDeGarde: [] },
		avril: { déclarationsDeGarde: [] },
		mai: { déclarationsDeGarde: [] },
	},
}
