import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Either, Option } from 'effect'
import { AnyAction, Reducer } from 'redux'
import { createSelector } from 'reselect'

import {
	calculeCotisations,
	RegimeCotisation,
	SituationÉconomieCollaborative,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import { SituationIncomplète } from '@/contextes/économie-collaborative/domaine/location-de-meublé/erreurs'
import { calculeRevenuNet } from '@/contextes/économie-collaborative/domaine/location-de-meublé/revenu-net'
import {
	estSituationValide,
	isSituationÉconomieCollaborative,
	SITUATION_ÉCONOMIE_COLLABORATIVE,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import { Montant } from '@/domaine/Montant'
import { Situation, SituationAction } from '@/domaine/Situation'

export const initialLocationDeMeubleState: SituationÉconomieCollaborative = {
	_tag: 'Situation',
	_type: SITUATION_ÉCONOMIE_COLLABORATIVE,
	recettes: Option.none(),
	regimeCotisation: Option.none(),
	estAlsaceMoselle: Option.none(),
	premièreAnnée: Option.none(),
}

const actionDeSituation = <T>(
	payload?: T
): Omit<SituationAction, 'type'> & { payload: T } => ({
	_situationType: SITUATION_ÉCONOMIE_COLLABORATIVE,
	payload: payload as T,
})

export const économieCollaborativeSlice = createSlice({
	name: 'économieCollaborative',
	initialState: initialLocationDeMeubleState,
	reducers: {
		setRecettes: {
			reducer: (
				state,
				action: PayloadAction<Option.Option<Montant<'EuroParAn'>>>
			) => {
				state.recettes = action.payload
			},
			prepare: actionDeSituation,
		},

		setRegimeCotisation: {
			reducer: (
				state,
				action: PayloadAction<Option.Option<RegimeCotisation>>
			) => {
				state.regimeCotisation = action.payload
			},
			prepare: actionDeSituation,
		},

		setEstAlsaceMoselle: {
			reducer: (state, action: PayloadAction<Option.Option<boolean>>) => {
				state.estAlsaceMoselle = action.payload
			},
			prepare: actionDeSituation,
		},

		setPremiereAnnee: {
			reducer: (state, action: PayloadAction<Option.Option<boolean>>) => {
				state.premièreAnnée = action.payload
			},
			prepare: actionDeSituation,
		},

		setSituation: {
			reducer: (
				_state,
				action: PayloadAction<SituationÉconomieCollaborative>
			) => {
				return action.payload
			},
			prepare: actionDeSituation,
		},

		reset: {
			reducer: () => initialLocationDeMeubleState,
			prepare: actionDeSituation,
		},
	},
	selectors: {
		selectLocationDeMeubleCotisations: createSelector(
			[(s?: SituationÉconomieCollaborative) => s],
			(situation) =>
				situation && isSituationÉconomieCollaborative(situation)
					? calculeCotisations(situation)
					: Either.left(
							new SituationIncomplète({
								message: 'Impossible de calculer les cotisations du simulateur',
							})
					  )
		),
		selectLocationDeMeubleRevenuNet: createSelector(
			[(s?: SituationÉconomieCollaborative) => s],
			(situation) =>
				situation &&
				isSituationÉconomieCollaborative(situation) &&
				estSituationValide(situation)
					? calculeRevenuNet(situation)
					: Either.left(
							new SituationIncomplète({
								message:
									'Impossible de calculer le revenu net sans connaitre les recettes',
							})
					  )
		),
	},
})

export const économieCollaborativeReducer: Reducer<Situation> = (
	state: Situation = initialLocationDeMeubleState,
	action: AnyAction
) => {
	if (isSituationÉconomieCollaborative(state))
		return économieCollaborativeSlice.reducer(state, action)

	if (
		action.type === `${économieCollaborativeSlice.name}/reset` ||
		action.type === `${économieCollaborativeSlice.name}/setSituation`
	) {
		return économieCollaborativeSlice.reducer(
			initialLocationDeMeubleState,
			action
		)
	}

	return state
}

type Actions = typeof économieCollaborativeSlice.actions

export type LocationDeMeubleAction = ReturnType<Actions[keyof Actions]>
