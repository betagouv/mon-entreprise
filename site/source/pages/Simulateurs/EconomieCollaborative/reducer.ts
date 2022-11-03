import { combineReducers } from 'redux'

import { getValueFrom } from '@/utils'

import { Action } from './actions'
import {
	flatActivités,
	getActivité,
	getMinimumDéclaration,
	getSousActivités,
} from './activitésData'
import { reduceReducers } from './customReduceReducers'

type Bool = boolean

const activitéReducer = (reducerActivité: string) =>
	combineReducers({
		effectuée: (state: Bool = false, { type, activité }: Action) =>
			type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' && reducerActivité === activité
				? !state
				: !!state,
		vue: (state: Bool = false, { type, activité }: Action) => {
			if (type === 'ACTIVITÉ_VUE' && reducerActivité === activité) {
				return true
			}
			if (
				type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' &&
				reducerActivité === activité
			) {
				return false
			}

			return !!state
		},
		seuilRevenus: (
			state:
				| 'RÉGIME_GÉNÉRAL_NON_DISPONIBLE'
				| 'RÉGIME_GÉNÉRAL_DISPONIBLE'
				| 'IMPOSITION'
				| 'AUCUN'
				| null = getMinimumDéclaration(reducerActivité),
			action: Action
		) =>
			action.type === 'SELECT_SEUIL_REVENUS_ATTEINT' &&
			reducerActivité === action.activité
				? action.seuilAtteint
				: state,
		critèresExonération: (
			state: Array<boolean> = getDefaultCritères(reducerActivité),
			action: Action
		) => {
			if (
				action.type === 'CHANGE_CRITÈRE_EXONÉRATION' &&
				reducerActivité === action.activité
			) {
				state[parseInt(action.index)] = action.estRespecté

				return [...state]
			}

			return state
		},
	})

function getDefaultCritères(reducerActivité: string) {
	const activité = getActivité(reducerActivité)
	const exonération = getValueFrom(activité, 'exonérée si')
	const exceptionExonération = getValueFrom(activité, 'exonérée sauf si')

	return (exonération ?? exceptionExonération ?? []).map<false>(() => false)
}

type ActivityTitle = string

export type State = Record<
	ActivityTitle,
	ReturnType<ReturnType<typeof activitéReducer>>
>

const reducer = reduceReducers<State, Action>(
	(state, { type, activité }) => {
		if (type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' && state[activité].effectuée) {
			return getSousActivités(activité).reduce(
				(newState, sousActivité) => ({
					...newState,
					[sousActivité]: {
						...state[sousActivité],
						effectuée: false,
						vue: false,
					},
				}),
				state
			)
		}

		return state
	},
	combineReducers(
		flatActivités.reduce(
			(reducers, { titre }) => ({
				[titre]: activitéReducer(titre),
				...reducers,
			}),
			{}
		)
	)
)

export default reducer
