import { DottedName } from 'modele-social'

import { RootState, Simulation } from '@/reducers/rootReducer'

export type PreviousSimulation = {
	situation: Simulation['situation']
	activeTargetInput: DottedName | null
	foldedSteps: Array<DottedName> | undefined
}

export const currentSimulationSelector = (
	state: RootState
): PreviousSimulation => {
	return {
		situation: state.simulation?.situation ?? {},
		activeTargetInput: state.activeTargetInput,
		foldedSteps: state.simulation?.foldedSteps,
	}
}
