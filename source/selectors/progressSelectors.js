/* @flow */
import { createSelector, createStructuredSelector } from 'reselect'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import { softCatch } from '../utils'

const STATUS_SELECTION_COEFFICIENT = 0.4
const NUMBER_MAX_QUESTION_COMPANY = 5
const companyProgressSelector = createSelector(
	state => state.inFranceApp.companyLegalStatus,
	state => state.inFranceApp.existingCompanyDetails,
	state => state.inFranceApp.companyStatusChoice,
	state => state.inFranceApp.companyCreationChecklist,
	(
		legalStatus,
		companyDetails,
		companyStatusChoice,
		companyCreationChecklist
	) => {
		if (companyDetails) {
			return 100
		}
		if (!companyStatusChoice) {
			return (
				100 *
				STATUS_SELECTION_COEFFICIENT *
				(Object.values(legalStatus).length / NUMBER_MAX_QUESTION_COMPANY)
			)
		}
		const checklist = Object.values(companyCreationChecklist)
		return (
			100 *
			(STATUS_SELECTION_COEFFICIENT +
				((1 - STATUS_SELECTION_COEFFICIENT) *
					checklist.filter(Boolean).length) /
					checklist.length)
		)
	}
)

const NUMBER_MAX_QUESTION_SIMULATION = 18
const START_SIMULATION_COEFFICIENT = 0.15
const QUESTIONS_COEFFICIENT = 0.85
export const estimationProgressSelector = state => {
	const userInputProgress = +(
		!noUserInputSelector(state) &&
		!softCatch(blockingInputControlsSelector)(state)
	)
	const questionsProgress =
		(state.conversationStarted &&
			NUMBER_MAX_QUESTION_SIMULATION - nextStepsSelector(state).length) /
		NUMBER_MAX_QUESTION_SIMULATION
	return (
		100 *
		(userInputProgress * START_SIMULATION_COEFFICIENT +
			questionsProgress * QUESTIONS_COEFFICIENT)
	)
}

const hiringProgressSelector = state => {
	const hiringChecklist = Object.values(state.inFranceApp.hiringChecklist)
	if (!hiringChecklist.length) {
		return 0
	}
	return (100 * hiringChecklist.filter(Boolean).length) / hiringChecklist.length
}

// $FlowFixMe
export default createStructuredSelector({
	companyProgress: companyProgressSelector,
	estimationProgress: estimationProgressSelector,
	hiringProgress: hiringProgressSelector
})
