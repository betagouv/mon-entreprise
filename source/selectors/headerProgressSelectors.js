/* @flow */
import { createSelector, createStructuredSelector } from 'reselect'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'

const STATUS_SELECTION_COEFFICIENT = 0.6
const companyProgressSelector = createSelector(
	state => state.inFranceApp.companyLegalStatus,
	state => state.inFranceApp.existingCompanyDetails,
	state => state.inFranceApp.companyRegistrationStarted,
	(legalStatus, companyDetails, companyRegistrationStarted) => {
		if (companyDetails) {
			return 100
		}
		const legalStatusProgress = Math.max(
			(STATUS_SELECTION_COEFFICIENT * Object.values(legalStatus).length) / 4,
			companyRegistrationStarted
		)
		return 80 * legalStatusProgress
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
