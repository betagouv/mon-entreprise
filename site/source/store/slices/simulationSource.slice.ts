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
	règlesIgnorées: DottedName[]
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
				règlesIgnorées: action.payload,
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
					règlesIgnorées: [] as DottedName[],
				})
			)
			.addMatcher(
				(action) => action.type === 'SUPPRIME_LA_RÈGLE_DE_LA_SITUATION',
				(state, action: { fieldName: DottedName }) => {
					if (state) {
						state.règlesIgnorées.push(action.fieldName)
					}
				}
			)
	},
})

export const { simulationChargéeDepuisLien, fermeLeBandeau } =
	simulationSourceSlice.actions

export const simulationSourceReducer = simulationSourceSlice.reducer
