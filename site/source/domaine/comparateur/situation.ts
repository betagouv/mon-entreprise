import * as O from 'effect/Option'

import { Montant, MontantRécurrent } from '../Montant'
import { Quantité } from '../Quantité'
import { Situation } from '../Situation'

export interface SituationComparée extends Situation {
	_type: 'comparateur'
	chiffreDAffaires: MontantRécurrent
	charges: MontantRécurrent
	natureActivité: 'artisanale' | 'commerciale' | 'libérale'
	typeActivité: O.Option<'vente' | 'service'>
	activitéLibéraleRéglementée: O.Option<boolean>
	méthodeImposition: 'barème standard' | 'taux personnalisé'
	tauxImposition: O.Option<Quantité<'%'>>
	situationFamiliale: O.Option<'célibataire' | 'couple' | 'veuf'>
	enfants: O.Option<Quantité<'enfant'>>
	autresRevenus: O.Option<Montant<'€/an'>>
	tva: boolean
}

export type Question = keyof Omit<
	SituationComparée,
	'chiffreDAffaires' | 'charges'
>

export type Réponse<T extends Question> = SituationComparée[T]
