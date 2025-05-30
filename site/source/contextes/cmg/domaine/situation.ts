import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

import { EnfantsÀCharge } from './enfant'
import { SalariéeAMA, SalariéeGED } from './salariée'

export interface SituationCMG<PrénomsEnfants extends string = string>
	extends Situation {
	ressources: O.Option<M.Montant<'EuroParAn'>>
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	modesDeGarde: {
		GED: Array<SalariéeGED>
		AMA: Array<SalariéeAMA<PrénomsEnfants>>
	}
}

export interface SituationCMGValide extends SituationCMG {
	ressources: O.Some<M.Montant<'EuroParAn'>>
}

export const initialSituationCMG: SituationCMG = {
	_tag: 'Situation',
	ressources: O.none(),
	enfantsÀCharge: {
		enfants: {
			'': { prénom: O.none(), dateDeNaissance: O.none() },
		},
		AeeH: O.none(),
	},
	modesDeGarde: {
		GED: [],
		AMA: [],
	},
}
