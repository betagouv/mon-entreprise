import * as O from 'effect/Option'

import { Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

export interface SituationÉconomieCollaborative extends Situation {
	typeLocation: O.Option<TypeLocation>
	recettes: O.Option<Montant<'€/an'>>
	regimeCotisation: O.Option<RegimeCotisation>
	estAlsaceMoselle: O.Option<boolean>
	premièreAnnée: O.Option<boolean>
}

export type TypeLocation = 'non-classé' | 'tourisme' | 'chambre-hôte'

export enum RegimeCotisation {
	microEntreprise = 'micro-entreprise',
	travailleurIndependant = 'travailleur-indépendant',
	regimeGeneral = 'régime-général',
}

export const initialSituationÉconomieCollaborative: SituationÉconomieCollaborative =
	{
		_tag: 'Situation',
		typeLocation: O.none(),
		recettes: O.none(),
		regimeCotisation: O.none(),
		estAlsaceMoselle: O.none(),
		premièreAnnée: O.none(),
	}

export interface SituationÉconomieCollaborativeValide
	extends SituationÉconomieCollaborative {
	recettes: O.Some<Montant<'€/an'>>
}

export function estSituationValide(
	situation: SituationÉconomieCollaborative
): situation is SituationÉconomieCollaborativeValide {
	return O.isSome(situation.recettes)
}

export const usagerAChoisiUnRégimeDeCotisation = (
	situation: SituationÉconomieCollaborative
) => O.isSome(situation.regimeCotisation)
