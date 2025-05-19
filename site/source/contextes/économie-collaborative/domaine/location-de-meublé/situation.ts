import * as O from 'effect/Option'

import { Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

export const SITUATION_ÉCONOMIE_COLLABORATIVE =
	'économie-collaborative' as const

export interface SituationÉconomieCollaborative extends Situation {
	_type: typeof SITUATION_ÉCONOMIE_COLLABORATIVE
	recettes: O.Option<Montant<'EuroParAn'>>
	regimeCotisation: O.Option<RegimeCotisation>
	estAlsaceMoselle: O.Option<boolean>
	premièreAnnée: O.Option<boolean>
}

export enum RegimeCotisation {
	microEntreprise = 'micro-entreprise',
	travailleurIndependant = 'travailleur-indépendant',
	regimeGeneral = 'régime-général',
}

export const isSituationÉconomieCollaborative = (
	situation: Situation
): situation is SituationÉconomieCollaborative =>
	situation._type === SITUATION_ÉCONOMIE_COLLABORATIVE

export interface SituationÉconomieCollaborativeValide
	extends SituationÉconomieCollaborative {
	recettes: O.Some<Montant<'EuroParAn'>>
}

export function estSituationValide(
	situation: SituationÉconomieCollaborative
): situation is SituationÉconomieCollaborativeValide {
	return O.isSome(situation.recettes)
}

export const usagerAChoisiUnRégimeDeCotisation = (
	situation: SituationÉconomieCollaborative
) => O.isSome(situation.regimeCotisation)
