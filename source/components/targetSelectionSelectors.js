import { createSelector } from 'reselect'
import {
	formattedSituationSelector,
	targetNamesSelector,
	parsedRulesSelector
} from 'Selectors/analyseSelectors'
import { findRuleByDottedName } from 'Engine/rules'

export let firstStepCompletedSelector = createSelector(
	[
		formattedSituationSelector,
		targetNamesSelector,
		parsedRulesSelector,
		state => state.simulation?.config?.bloquant
	],
	(situation, targetNames, parsedRules, bloquant) => {
		if (!situation) {
			return true
		}
		const situations = Object.keys(situation)
		const allBlockingAreAnswered =
			bloquant && bloquant.every(rule => situations.includes(rule))
		const targetIsAnswered =
			targetNames &&
			targetNames.some(
				targetName =>
					findRuleByDottedName(parsedRules, targetName)?.formule &&
					targetName in situation
			)
		return allBlockingAreAnswered || targetIsAnswered
	}
)
