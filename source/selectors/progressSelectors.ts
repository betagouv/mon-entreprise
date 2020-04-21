import { RootState } from 'Reducers/rootReducer'
import { nextStepsSelector } from './analyseSelectors'

export const simulationProgressSelector = (state: RootState) => {
	const numberQuestionAnswered = state.simulation?.foldedSteps.length || 0
	const numberQuestionLeft = nextStepsSelector(state).length
	return numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft)
}
