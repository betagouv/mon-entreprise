import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import {
	flatActivités,
	getActivité,
	getMinimumDéclaration,
	getSousActivités
} from './activitésData'

const activitéReducer = reducerActivité =>
	combineReducers({
		effectuée: (state = false, { type, activité }) =>
			type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' && reducerActivité === activité
				? !state
				: state,
		vue: (state = false, { type, activité }) => {
			if (type === 'ACTIVITÉ_VUE' && reducerActivité === activité) {
				return true
			}
			if (
				type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' &&
				reducerActivité === activité
			) {
				return false
			}
			return state
		},
		seuilRevenus: (
			state = getMinimumDéclaration(reducerActivité),
			{ type, activité, seuilAtteint }
		) =>
			type === 'SELECT_SEUIL_REVENUS_ATTEINT' && reducerActivité === activité
				? seuilAtteint
				: state,
		critèresExonération: (
			state = new Array(
				(getActivité(reducerActivité)['exonérée sauf si'] || []).length
			).fill(true),
			{ activité, type, index, estRespecté }
		) => {
			if (
				type === 'CHANGE_CRITÈRE_EXONÉRATION' &&
				reducerActivité === activité
			) {
				state[index] = estRespecté
				return [...state]
			}
			return state
		}
	})

let reducer = reduceReducers(
	(state, { type, activité }) => {
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
	},
	combineReducers(
		flatActivités.reduce(
			(reducers, { titre }) => ({
				[titre]: activitéReducer(titre),
				...reducers
			}),
			{}
		)
	)
)

export default reducer
