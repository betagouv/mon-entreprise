/* @flow */
import { createSelector, createStructuredSelector } from 'reselect'
import {
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'

const LEGAL_STATUS_COEFFICIENT = 0.3
const CHECKLIST_COEFFICIENT = 0.7
const CHECKLIST_ITEM_NUMBER = 7
const companyProgressSelector = createSelector(
	state => state.inFranceApp.companyLegalStatus,
	state => state.inFranceApp.companyCreationChecklist,
	(legalStatus, creationChecklist) => {
		const legalStatusProgress = Object.values(legalStatus).length / 3
		const creationChecklistProgress =
			Object.values(creationChecklist).filter(Boolean).length /
			CHECKLIST_ITEM_NUMBER

		return (
			100 *
			(legalStatusProgress * LEGAL_STATUS_COEFFICIENT +
				creationChecklistProgress * CHECKLIST_COEFFICIENT)
		)
	}
)

const NUMBER_MAX_QUESTION = 18
const START_SIMULATION_COEFFICIENT = 0.15
const QUESTIONS_COEFFICIENT = 0.85
const estimationProgressSelector = state => {
	return (
		100 *
		(START_SIMULATION_COEFFICIENT * !noUserInputSelector(state) +
			QUESTIONS_COEFFICIENT *
				(1 - nextStepsSelector(state).length / NUMBER_MAX_QUESTION))
	)
}

export default createStructuredSelector({
	companyProgress: companyProgressSelector,
	estimationProgress: estimationProgressSelector
})
