import { RootState, Simulation } from '@/reducers/rootReducer'
import { DottedName } from 'modele-social'

export type PreviousSimulation = {
	situation: Simulation['situation']
	activeTargetInput: RootState['activeTargetInput']
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
