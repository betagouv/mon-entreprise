import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'

import { DéclarationDeGarde } from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'

export interface MoisHistorique<PrénomsEnfants extends string = string> {
	// TODO: à remplacer par l'utilisation de déclarationDeGarde.CMGPerçu
	droitsOuverts: boolean
	ressources: O.Option<M.Montant<'Euro'>>
	déclarationsDeGarde: Array<DéclarationDeGarde<PrénomsEnfants>>
}

export interface SituationCMG<PrénomsEnfants extends string = string> {
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	historique: {
		mars: MoisHistorique<PrénomsEnfants>
		avril: MoisHistorique<PrénomsEnfants>
		mai: MoisHistorique<PrénomsEnfants>
	}
}
