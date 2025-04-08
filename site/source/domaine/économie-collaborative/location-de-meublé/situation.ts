import { Option } from 'effect'

import { EuroParAn } from '@/domaine/Montant'

export type RegimeCotisation =
	| 'micro-entreprise'
	| 'travailleur-indépendant'
	| 'régime-général'

export interface SituationLocationCourteDuree {
	recettes: Option.Option<EuroParAn>
	regimeCotisation: Option.Option<RegimeCotisation>
	estAlsaceMoselle: Option.Option<boolean>
	premièreAnnée: Option.Option<boolean>
}

export interface SituationLocationCourteDureeValide
	extends SituationLocationCourteDuree {
	recettes: Option.Some<EuroParAn>
}

export function estSituationValide(
	situation: SituationLocationCourteDuree
): situation is SituationLocationCourteDureeValide {
	return Option.isSome(situation.recettes)
}
