import { Option } from 'effect'

import { EuroParAn } from '@/domaine/Montant'

export enum RegimeCotisation {
	microEntreprise = 'micro-entreprise',
	travailleurIndependant = 'travailleur-indépendant',
	regimeGeneral = 'régime-général',
}

export interface Situation {
	_tag: 'Situation'
}

export interface SituationLocationCourteDuree extends Situation {
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
