import { Reducer } from 'redux'

import { Situation, SituationAction } from '@/domaine/Situation'
import { RootState } from '@/store/reducers/rootReducer'

export type SimulateurType =
	| 'location-de-meuble'
	| 'salarié'
	| 'indépendant'
	| 'auto-entrepreneur'
// ...

const initialState = { _tag: 'Situation' } satisfies Situation

const situationReducers: Record<string, Reducer<Situation>> = {}

export const registerSituationReducer = (
	type: string,
	reducer: Reducer<Situation>
) => (situationReducers[type] = reducer)

export const situationReducer: Reducer<Situation, SituationAction> = (
	state = initialState,
	action: SituationAction
) => {
	const reducer = situationReducers[action._situationType]

	return reducer ? reducer(state, action) : state
}

export const selectSituation = (state: RootState) => state.situation

export default situationReducer
