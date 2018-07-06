/* @flow */
import { createSelector, createStructuredSelector } from 'reselect'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'

const LEGAL_STATUS_COEFFICIENT = 0.3
const CHECKLIST_COEFFICIENT = 0.7
const CHECKLIST_ITEM_NUMBER = 7
const companyProgressSelector = createSelector(
	state => state.inFranceApp.companyLegalStatus,
	state => state.inFranceApp.companyCreationChecklist,
	state => state.inFranceApp.existingCompanyDetails,
	(legalStatus, creationChecklist, companyDetails) => {
		if (companyDetails) {
			return 100
		}
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
	const userInputProgress = +(
		!noUserInputSelector(state) && !blockingInputControlsSelector(state)
	)
	const questionsProgress =
		(state.conversationStarted &&
			NUMBER_MAX_QUESTION - nextStepsSelector(state).length) /
		NUMBER_MAX_QUESTION
	return (
		100 *
		(userInputProgress * START_SIMULATION_COEFFICIENT +
			questionsProgress * QUESTIONS_COEFFICIENT)
	)
}

export default createStructuredSelector({
	companyProgress: companyProgressSelector,
	estimationProgress: estimationProgressSelector
})
