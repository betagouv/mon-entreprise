import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import { Action } from './actions'
import {
	flatActivités,
	getActivité,
	getMinimumDéclaration,
	getSousActivités
} from './activitésData'

const activitéReducer = reducerActivité =>
	combineReducers({
		effectuée: (state = false, { type, activité }: Action): boolean =>
			type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' && reducerActivité === activité
				? !state
				: !!state,
		vue: (state = false, { type, activité }: Action): boolean => {
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
			state = getMinimumDéclaration(reducerActivité),
			action: Action
		) =>
			action.type === 'SELECT_SEUIL_REVENUS_ATTEINT' &&
			reducerActivité === action.activité
				? action.seuilAtteint
				: state,
		critèresExonération: (
			state: Array<boolean> = new Array(
				(getActivité(reducerActivité)['exonérée sauf si'] || []).length
			).fill(true),
			action: Action
		) => {
			if (
				action.type === 'CHANGE_CRITÈRE_EXONÉRATION' &&
				reducerActivité === action.activité
			) {
				state[action.index] = action.estRespecté
				return [...state]
			}
			return state
		}
	})

// type ActivityTitle = string
// type State = Record<ActivityTitle, ReturnType<ReturnType<typeof activitéReducer>>>

const reducer = reduceReducers(
	((state, { type, activité }: Action) => {
		if (type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' && state[activité].effectuée) {
			return getSousActivités(activité).reduce(
				(newState, sousActivité) => ({
					...newState,
					[sousActivité]: {
						...state[sousActivité],
						effectuée: false,
						vue: false
					}
				}),
				state
			)
		}
		return state
	}) as any,
	combineReducers(
		flatActivités.reduce(
			(reducers, { titre }) => ({
				[titre]: activitéReducer(titre),
				...reducers
			}),
			{}
		)
	) as any
)

export default reducer
