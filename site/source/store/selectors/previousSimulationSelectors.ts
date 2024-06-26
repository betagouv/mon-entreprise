import { DottedName } from 'modele-social'

import { RootState } from '@/store/reducers/rootReducer'
import { Simulation } from '@/store/reducers/simulation.reducer'

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
		foldedSteps: state.simulation?.answeredQuestions,
	}
}
