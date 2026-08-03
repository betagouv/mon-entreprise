import * as O from 'effect/Option'

import { eurosParAn, Montant, MontantRécurrent } from '@/domaine/Montant'
import { quantité, Quantité } from '@/domaine/Quantite'
import { Situation } from '@/domaine/Situation'

import { NatureActivité, TypeActivité } from './activite'
import { MéthodeImposition, SituationFamiliale } from './imposition'

export interface SituationComparée extends Situation {
	_type: 'comparaison-statuts'
	chiffreDAffaires: O.Option<MontantRécurrent>
	charges: O.Option<MontantRécurrent>
	natureActivité: NatureActivité
	typeActivité: TypeActivité
	activitéLibéraleRéglementée: boolean
	méthodeImposition: MéthodeImposition
	tauxImposition: O.Option<Quantité<'%'>>
	situationFamiliale: SituationFamiliale
	enfants: Quantité<'enfant'>
	autresRevenus: Montant<'€/an'>
	tva: boolean
}

export type Question = keyof Omit<
	SituationComparée,
	'chiffreDAffaires' | 'charges'
>

export type Réponse<T extends Question> = SituationComparée[T]

interface SituationComparéeBarèmeValide extends SituationComparée {
	chiffreDAffaires: O.Some<MontantRécurrent>
	méthodeImposition: 'barème standard'
}
interface SituationComparéeTauxPersoValide extends SituationComparée {
	chiffreDAffaires: O.Some<MontantRécurrent>
	méthodeImposition: 'taux personnalisé'
	tauxImposition: O.Some<Quantité<'%'>>
}

export type SituationComparéeValide =
	| SituationComparéeBarèmeValide
	| SituationComparéeTauxPersoValide

export const initialSituationComparée: SituationComparée = {
	_tag: 'Situation',
	_type: 'comparaison-statuts',
	chiffreDAffaires: O.none(),
	charges: O.none(),
	natureActivité: 'commerciale',
	typeActivité: 'vente',
	activitéLibéraleRéglementée: false,
	méthodeImposition: 'barème standard',
	tauxImposition: O.none(),
	situationFamiliale: 'célibataire',
	enfants: quantité(0, 'enfant'),
	autresRevenus: eurosParAn(0),
	tva: true,
}

export const estSituationValide = (
	situation: SituationComparée
): situation is SituationComparéeValide =>
	O.isSome(situation.chiffreDAffaires) &&
	(situation.méthodeImposition === 'barème standard' ||
		O.isSome(situation.tauxImposition))

export const simulationEstCommencée = (situation: SituationComparée): boolean =>
	O.isSome(situation.chiffreDAffaires) || O.isSome(situation.charges)
