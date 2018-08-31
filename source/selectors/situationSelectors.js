import { isEmpty } from 'ramda'
import { getFormValues } from 'redux-form'
import { createSelector } from 'reselect'
import { createDeepEqualSelector } from '../utils'

export let situationSelector = createDeepEqualSelector(
	getFormValues('conversation'),
	x => x
)

export let noUserInputSelector = createSelector(
	[situationSelector],
	situation => !situation || isEmpty(situation)
)

export let validatedStepsSelector = createSelector(
	[
		state => state.conversationSteps.foldedSteps,
		state => state.activeTargetInput
	],
	(foldedSteps, target) => [...foldedSteps, target]
)
