import * as O from 'effect/Option'

import { estPositif, Montant } from '@/domaine/Montant'
import { eurosParAn, MontantRécurrent } from '@/domaine/MontantRécurrent'
import { quantité, Quantité } from '@/domaine/Quantite'
import { Situation } from '@/domaine/Situation'

import { NatureActivité, TypeActivité } from './activite'
import { IRouIS, MéthodeImposition, SituationFamiliale } from './imposition'

export interface SituationComparée extends Situation {
	_type: 'comparaison-statuts'
	chiffreDAffaires: O.Option<MontantRécurrent>
	charges: O.Option<MontantRécurrent>
	IRouIS: IRouIS
	versementLibératoire: boolean
	natureActivité: NatureActivité
	typeActivité: TypeActivité
	activitéLibéraleRéglementée: boolean
	acre: boolean
	méthodeImposition: MéthodeImposition
	tauxImposition: O.Option<Quantité<'%'>>
	situationFamiliale: SituationFamiliale
	enfants: Quantité<'enfant'>
	parentIsolé: boolean
	autresRevenus: Montant<'€/an'>
	tva: boolean
}

export type Question = keyof Omit<
	SituationComparée,
	'chiffreDAffaires' | 'charges' | 'IRouIS' | 'versementLibératoire'
>

export type Réponse<T extends Question> = SituationComparée[T]

interface SituationComparéeValide extends SituationComparée {
	chiffreDAffaires: O.Some<MontantRécurrent>
}

export const initialSituationComparée: SituationComparée = {
	_tag: 'Situation',
	_type: 'comparaison-statuts',
	chiffreDAffaires: O.none(),
	charges: O.none(),
	IRouIS: 'IR',
	versementLibératoire: false,
	natureActivité: 'commerciale',
	typeActivité: 'vente',
	activitéLibéraleRéglementée: false,
	acre: false,
	tva: true,
	méthodeImposition: 'barème standard',
	tauxImposition: O.none(),
	situationFamiliale: 'célibataire',
	enfants: quantité(0, 'enfant'),
	parentIsolé: false,
	autresRevenus: eurosParAn(0),
}

export const estSituationValide = (
	situation: SituationComparée
): situation is SituationComparéeValide =>
	O.isSome(situation.chiffreDAffaires) &&
	estPositif(situation.chiffreDAffaires.value)

export const simulationEstCommencée = (situation: SituationComparée): boolean =>
	Object.keys(situation).some(
		(élémentSituation) =>
			situation[élémentSituation as keyof SituationComparée] !==
			initialSituationComparée[élémentSituation as keyof SituationComparée]
	)
