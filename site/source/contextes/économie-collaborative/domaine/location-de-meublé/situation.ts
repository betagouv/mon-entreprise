import * as O from 'effect/Option'

import { eurosParAn, Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

export interface SituationÉconomieCollaborative extends Situation {
	typeLocation: O.Option<TypeLocation>
	recettes: O.Option<Montant<'€/an'>>
	autresRevenus: O.Option<Montant<'€/an'>>
	typeDurée: O.Option<TypeDurée>
	estAlsaceMoselle: O.Option<boolean>
	premièreAnnée: O.Option<boolean>
}

export type TypeLocation = 'non-classé' | 'tourisme' | 'chambre-hôte'
export type TypeDurée = 'courte' | 'longue' | 'mixte'

export const situationParDéfaut = {
	typeLocation: 'non-classé' as TypeLocation,
	autresRevenus: eurosParAn(0),
	typeDurée: 'courte' as TypeDurée,
	estAlsaceMoselle: false,
	premièreAnnée: false,
}

export enum RegimeCotisation {
	microEntreprise = 'micro-entreprise',
	travailleurIndependant = 'travailleur-indépendant',
	regimeGeneral = 'régime-général',
	pasDAffiliation = 'pas-d-affiliation',
}

export const initialSituationÉconomieCollaborative: SituationÉconomieCollaborative =
	{
		_tag: 'Situation',
		typeLocation: O.none(),
		recettes: O.none(),
		autresRevenus: O.none(),
		typeDurée: O.none(),
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
