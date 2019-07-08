import reduceReducers from 'reduce-reducers'
import { combineReducers } from 'redux'
import {
	flatActivités,
	getMinimumDéclaration,
	getSousActivités
} from './activitésData'

const activitéReducer = activité =>
	combineReducers({
		effectuée: (state = false, action) =>
			action.type === 'TOGGLE_ACTIVITÉ_EFFECTUÉE' &&
			action.activité === activité
				? !state
				: state,
		répondue: (state = false, action) => {
			switch (action.type) {
				case 'SELECT_SEUIL_REVENUS_ATTEINT':
					return action.activité === activité || state
				case 'TOGGLE_ACTIVITÉ_EFFECTUÉE':
					return activité === action.activitéParente || state
				default:
					return state
			}
		},
		déclaration: (state = getMinimumDéclaration(activité), action) =>
			action.type !== 'SELECT_SEUIL_REVENUS_ATTEINT' ||
			action.activité !== activité
				? state
				: action.seuilAtteint
	})

let reducer = reduceReducers(
	(state, action) => console.group(action, state) || state,
	(state, { type, activité }) => {
		if (
			type !== 'TOGGLE_ACTIVITÉ_EFFECTUÉE' ||
			state[activité].effectuée === true
		) {
			return state
		}
		return getSousActivités(activité).reduce(
			(newState, sousActivité) => ({
				...state,
				[sousActivité]: { ...state[sousActivité], effectuée: false }
			}),
			state
		)
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
