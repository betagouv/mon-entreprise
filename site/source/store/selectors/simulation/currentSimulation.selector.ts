import { DottedName } from '@/domaine/publicodes/DottedName'
import { RootState } from '@/store/reducers/rootReducer'
import {
	QuestionRépondue,
	Simulation,
} from '@/store/reducers/simulation.reducer'

export type PreviousSimulation = {
	situation: Simulation['situation']
	activeTargetInput: DottedName | null
	questionsRépondues: Array<QuestionRépondue> | undefined
}

export const currentSimulationSelector = (
	state: RootState
): PreviousSimulation => {
	return {
		situation: state.simulation?.situation ?? {},
		activeTargetInput: state.activeTargetInput,
		questionsRépondues: state.simulation?.questionsRépondues,
	}
}
