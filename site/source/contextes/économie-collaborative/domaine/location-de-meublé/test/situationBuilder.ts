import * as O from 'effect/Option'

import { eurosParAn, Montant } from '@/domaine/Montant'

import {
	Classement,
	SituationChambreDHôteValide,
	SituationMeubléDeTourismeValide,
	TypeDurée,
} from '../situation'

type SituationBuilderState = {
	recettes?: number
	recettesCourteDurée?: number
	autresRevenus?: number
	typeDurée?: TypeDurée
	classement?: Classement
	estAlsaceMoselle?: boolean
	premièreAnnée?: boolean
}

type SituationBuilderApi = {
	avecRecettes: (recettes: number) => SituationBuilderApi
	avecRecettesCourteDurée: (recettesCourteDurée: number) => SituationBuilderApi
	avecAutresRevenus: (autresRevenus: number) => SituationBuilderApi
	avecTypeDurée: (typeDurée: TypeDurée) => SituationBuilderApi
	avecClassement: (classement: Classement) => SituationBuilderApi
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
		avecRecettesCourteDurée: (recettesCourteDurée) =>
			situationMeubléDeTourismeBuilder({
				...state,
				recettesCourteDurée,
				typeDurée: state.typeDurée === 'longue' ? 'mixte' : state.typeDurée,
			}),
		avecAutresRevenus: (autresRevenus) =>
			situationMeubléDeTourismeBuilder({ ...state, autresRevenus }),
		avecTypeDurée: (typeDurée) =>
			situationMeubléDeTourismeBuilder(
				typeDurée === 'longue'
					? { ...state, typeDurée, recettesCourteDurée: undefined }
					: { ...state, typeDurée }
			),
		avecClassement: (classement) =>
			situationMeubléDeTourismeBuilder({ ...state, classement }),
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

			const baseSituation = {
				_tag: 'Situation' as const,
				_type: 'économie-collaborative' as const,
				typeHébergement: 'meublé-tourisme' as const,
				recettes: O.some(eurosParAn(state.recettes)) as O.Some<Montant<'€/an'>>,
				autresRevenus: O.fromNullable(state.autresRevenus).pipe(
					O.map(eurosParAn)
				),
				classement: O.fromNullable(state.classement),
				estAlsaceMoselle: O.fromNullable(state.estAlsaceMoselle),
				premièreAnnée: O.fromNullable(state.premièreAnnée),
			}

			if (state.typeDurée === 'longue') {
				return {
					...baseSituation,
					typeDurée: O.some(state.typeDurée),
				} as SituationMeubléDeTourismeValide
			}

			if (state.typeDurée === 'courte' || state.typeDurée === 'mixte') {
				return {
					...baseSituation,
					typeDurée: O.some(state.typeDurée),
					recettesCourteDurée: O.fromNullable(state.recettesCourteDurée).pipe(
						O.map(eurosParAn)
					),
				} as SituationMeubléDeTourismeValide
			}

			return {
				...baseSituation,
				typeDurée: O.none() as O.None<TypeDurée>,
			} as SituationMeubléDeTourismeValide
		},
	}
}

type SituationChambreDHôteBuilderState = {
	revenuNet?: number
}

type SituationChambreDHôteBuilderApi = {
	avecRevenuNet: (revenuNet: number) => SituationChambreDHôteBuilderApi
	build: () => SituationChambreDHôteValide
}

export function situationChambreDHôteBuilder(
	state: SituationChambreDHôteBuilderState = {}
): SituationChambreDHôteBuilderApi {
	return {
		avecRevenuNet: (revenuNet) =>
			situationChambreDHôteBuilder({ ...state, revenuNet }),
		build: () => {
			if (state.revenuNet === undefined) {
				throw new Error(
					"Le revenu net est obligatoire pour construire une situation chambre d'hôte valide"
				)
			}

			return {
				_tag: 'Situation',
				_type: 'économie-collaborative',
				typeHébergement: 'chambre-hôte',
				revenuNet: O.some(eurosParAn(state.revenuNet)) as O.Some<
					Montant<'€/an'>
				>,
				estAlsaceMoselle: O.none(),
				premièreAnnée: O.none(),
			}
		},
	}
}
