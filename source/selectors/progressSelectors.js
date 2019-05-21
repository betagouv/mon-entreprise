import { nextStepsSelector } from './analyseSelectors'

export const simulationProgressSelector = state => {
	const numberQuestionAnswered = state.conversationSteps.foldedSteps.length
	const numberQuestionLeft = nextStepsSelector(state).length
	return numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft)
}
