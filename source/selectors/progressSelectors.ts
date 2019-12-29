import { RootState } from 'Reducers/rootReducer'
import { nextStepsSelector } from './analyseSelectors'

export const simulationProgressSelector = (state: RootState) => {
	const numberQuestionAnswered = state.conversationSteps.foldedSteps.length
	const numberQuestionLeft = nextStepsSelector(state).length
	return numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft)
}
