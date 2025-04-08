import { combineSlices, createSlice } from '@reduxjs/toolkit'

import { SituationLocationCourteDuree } from '@/domaine/économie-collaborative/location-de-meublé/situation'
import { RootState } from '@/store/reducers/rootReducer'

import locationDeMeubleReducer from './locationDeMeubleSlice'

export type SimulateurType =
	| 'location-de-meuble'
	| 'salarié'
	| 'indépendant'
	| 'auto-entrepreneur'
// ...

export interface SimulateursMetaState {
	simulateurActif: SimulateurType | null
}

const initialMetaState: SimulateursMetaState = {
	simulateurActif: null,
}

export const simulateursMetaSlice = createSlice({
	name: 'simulateurs/meta',
	initialState: initialMetaState,
	reducers: {
		activeLocationDeMeuble: (state) => {
			state.simulateurActif = 'location-de-meuble'
		},
		reset: (state) => {
			state.simulateurActif = null
		},
	},
})

export const { activeLocationDeMeuble, reset } = simulateursMetaSlice.actions

export const simulateursSlice = combineSlices({
	meta: simulateursMetaSlice.reducer,
	locationDeMeuble: locationDeMeubleReducer,
})

export const selectSimulateurActif = (state: RootState) =>
	state.simulateurs.meta.simulateurActif

export const selectEstLocationDeMeubleActif = (state: RootState) =>
	state.simulateurs.meta.simulateurActif === 'location-de-meuble'

export const selectLocationDeMeubleSituation = (
	state: RootState
): SituationLocationCourteDuree | null => {
	if (state.simulateurs.meta.simulateurActif !== 'location-de-meuble')
		return null

	return state.simulateurs.locationDeMeuble
}

export default simulateursSlice
