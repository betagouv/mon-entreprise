import * as O from 'effect/Option'

import { Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

export interface SituationÉconomieCollaborative extends Situation {
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

export const initialSituationÉconomieCollaborative: SituationÉconomieCollaborative =
	{
		_tag: 'Situation',
		recettes: O.none(),
		regimeCotisation: O.none(),
		estAlsaceMoselle: O.none(),
		premièreAnnée: O.none(),
	}

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
