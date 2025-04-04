import { EuroParAn } from '@/domaine/Montant'

export type RegimeCotisation =
	| 'micro-entreprise'
	| 'travailleur-indépendant'
	| 'régime-général'

export interface SituationLocationCourteDuree {
	recettes: EuroParAn
	regimeCotisation?: RegimeCotisation
	estAlsaceMoselle?: boolean
	premièreAnnée?: boolean
}
