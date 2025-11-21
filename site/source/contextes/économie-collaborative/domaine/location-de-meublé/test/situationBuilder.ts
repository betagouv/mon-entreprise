import * as O from 'effect/Option'

import { eurosParAn, Montant } from '@/domaine/Montant'

import {
	SituationMeubléDeTourismeValide,
	TypeDurée,
	TypeTourisme,
} from '../situation'

type SituationBuilderState = {
	recettes?: number
	autresRevenus?: number
	typeDurée?: TypeDurée
	typeTourisme?: TypeTourisme
	estAlsaceMoselle?: boolean
	premièreAnnée?: boolean
}

type SituationBuilderApi = {
	avecRecettes: (recettes: number) => SituationBuilderApi
	avecAutresRevenus: (autresRevenus: number) => SituationBuilderApi
	avecTypeDurée: (typeDurée: TypeDurée) => SituationBuilderApi
	avecTypeTourisme: (typeTourisme: TypeTourisme) => SituationBuilderApi
	avecAlsaceMoselle: (estAlsaceMoselle?: boolean) => SituationBuilderApi
	avecPremièreAnnée: (premièreAnnée?: boolean) => SituationBuilderApi
	build: () => SituationMeubléDeTourismeValide
}

export function situationMeubléDeTourismeBuilder(
	state: SituationBuilderState = {}
): SituationBuilderApi {
	return {
		avecRecettes: (recettes) =>
			situationMeubléDeTourismeBuilder({ ...state, recettes }),
		avecAutresRevenus: (autresRevenus) =>
			situationMeubléDeTourismeBuilder({ ...state, autresRevenus }),
		avecTypeDurée: (typeDurée) =>
			situationMeubléDeTourismeBuilder({ ...state, typeDurée }),
		avecTypeTourisme: (typeTourisme) =>
			situationMeubléDeTourismeBuilder({ ...state, typeTourisme }),
		avecAlsaceMoselle: (estAlsaceMoselle = true) =>
			situationMeubléDeTourismeBuilder({ ...state, estAlsaceMoselle }),
		avecPremièreAnnée: (premièreAnnée = true) =>
			situationMeubléDeTourismeBuilder({ ...state, premièreAnnée }),
		build: () => {
			if (state.recettes === undefined) {
				throw new Error(
					'Les recettes sont obligatoires pour construire une situation valide'
				)
			}

			return {
				_tag: 'Situation',
				_subtype: 'meublé-tourisme',
				recettes: O.some(eurosParAn(state.recettes)) as O.Some<Montant<'€/an'>>,
				autresRevenus: O.fromNullable(state.autresRevenus).pipe(
					O.map(eurosParAn)
				),
				typeDurée: O.fromNullable(state.typeDurée),
				typeTourisme: O.fromNullable(state.typeTourisme),
				estAlsaceMoselle: O.fromNullable(state.estAlsaceMoselle),
				premièreAnnée: O.fromNullable(state.premièreAnnée),
			}
		},
	}
}
