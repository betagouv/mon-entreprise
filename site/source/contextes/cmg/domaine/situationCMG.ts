import * as M from '@/domaine/Montant'

import { DéclarationDeGarde } from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'

export interface MoisHistorique<PrénomsEnfants extends string = string> {
	déclarationsDeGarde: Array<DéclarationDeGarde<PrénomsEnfants>>
}

export interface SituationCMG<PrénomsEnfants extends string = string> {
	ressources: M.Montant<'EuroParAn'>
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	historique: {
		mars: MoisHistorique<PrénomsEnfants>
		avril: MoisHistorique<PrénomsEnfants>
		mai: MoisHistorique<PrénomsEnfants>
	}
}
