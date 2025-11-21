import * as O from 'effect/Option'

import { eurosParAn, Montant } from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

interface SituationÉconomieCollaborativeBase extends Situation {
	estAlsaceMoselle: O.Option<boolean>
	premièreAnnée: O.Option<boolean>
}

export interface SituationChambreDHôte
	extends SituationÉconomieCollaborativeBase {
	_subtype: 'chambre-hôte'
	revenuNet: O.Option<Montant<'€/an'>>
}

export interface SituationMeubléDeTourisme
	extends SituationÉconomieCollaborativeBase {
	_subtype: 'meublé-tourisme'
	recettes: O.Option<Montant<'€/an'>>
	autresRevenus: O.Option<Montant<'€/an'>>
	typeDurée: O.Option<TypeDurée>
	typeTourisme: O.Option<TypeTourisme>
}

export type SituationÉconomieCollaborative =
	| SituationChambreDHôte
	| SituationMeubléDeTourisme

export type TypeTourisme =
	| 'tourisme-classé'
	| 'tourisme-non-classé'
	| 'tourisme-mixte'

export type TypeDurée = 'courte' | 'longue' | 'mixte'

export const situationParDéfaut = {
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

export const initialSituationMeubléDeTourisme: SituationMeubléDeTourisme = {
	_tag: 'Situation',
	_subtype: 'meublé-tourisme',
	recettes: O.none(),
	autresRevenus: O.none(),
	typeDurée: O.none(),
	typeTourisme: O.none(),
	estAlsaceMoselle: O.none(),
	premièreAnnée: O.none(),
}

export const initialSituationChambreDHôte: SituationChambreDHôte = {
	_tag: 'Situation',
	_subtype: 'chambre-hôte',
	revenuNet: O.none(),
	estAlsaceMoselle: O.none(),
	premièreAnnée: O.none(),
}

export interface SituationMeubléDeTourismeValide
	extends SituationMeubléDeTourisme {
	recettes: O.Some<Montant<'€/an'>>
}

export interface SituationChambreDHôteValide extends SituationChambreDHôte {
	revenuNet: O.Some<Montant<'€/an'>>
}

export type SituationÉconomieCollaborativeValide =
	| SituationMeubléDeTourismeValide
	| SituationChambreDHôteValide

export function estSituationMeubléDeTourismeValide(
	situation: SituationÉconomieCollaborative
): situation is SituationMeubléDeTourismeValide {
	return (
		situation._subtype === 'meublé-tourisme' && O.isSome(situation.recettes)
	)
}

export function estSituationChambreDHôteValide(
	situation: SituationÉconomieCollaborative
): situation is SituationChambreDHôteValide {
	return situation._subtype === 'chambre-hôte' && O.isSome(situation.revenuNet)
}

export function estSituationValide(
	situation: SituationÉconomieCollaborative
): situation is SituationÉconomieCollaborativeValide {
	return (
		estSituationMeubléDeTourismeValide(situation) ||
		estSituationChambreDHôteValide(situation)
	)
}
