import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DottedName } from '@/domaine/publicodes/DottedName'

export const OrigineSimulation = {
	LIEN_PARTAGÉ: 'lien-partagé',
	SAUVEGARDE: 'sauvegarde',
} as const

export type OrigineSimulation =
	(typeof OrigineSimulation)[keyof typeof OrigineSimulation]

export type SimulationSourceState = {
	origine: OrigineSimulation
	règlesObsolètes: DottedName[]
} | null

const simulationSourceSlice = createSlice({
	name: 'simulationSource',
	initialState: null as SimulationSourceState,
	reducers: {
		simulationChargéeDepuisLien(
			_,
			action: PayloadAction<DottedName[]>
		) {
			return {
				origine: OrigineSimulation.LIEN_PARTAGÉ,
				règlesObsolètes: action.payload,
			}
		},
		règleObsolèteDétectée(state, action: PayloadAction<DottedName>) {
			if (state) {
				state.règlesObsolètes.push(action.payload)
			}
		},
		fermeLeBandeau() {
			return null
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action) => action.type === 'CONFIGURE_LA_SIMULATION',
				() => null
			)
			.addMatcher(
				(action) => action.type === 'CHARGE_LA_SIMULATION_PRÉCÉDENTE',
				() => ({
					origine: OrigineSimulation.SAUVEGARDE,
					règlesObsolètes: [] as DottedName[],
				})
			)
	},
})

export const {
	simulationChargéeDepuisLien,
	règleObsolèteDétectée,
	fermeLeBandeau,
} = simulationSourceSlice.actions

export const simulationSourceReducer = simulationSourceSlice.reducer
