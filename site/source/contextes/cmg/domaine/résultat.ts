import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'

import { RaisonInéligibilité } from './éligibilité'
import { EnfantValide } from './enfant'

export interface Résultat {
	estÉligible: O.Option<boolean>
	raisonsInéligibilité: Array<RaisonInéligibilité>
	montantCT: O.Option<M.Montant<'Euro'>>
	enfantsOuvrantDroit: Array<EnfantValide>
}

export const initialRésultat: Résultat = {
	estÉligible: O.none(),
	raisonsInéligibilité: [],
	montantCT: O.none(),
	enfantsOuvrantDroit: [],
}
