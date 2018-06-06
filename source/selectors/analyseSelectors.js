import { createSelector } from 'reselect'
import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'

import { analyseMany, parseAll } from 'Engine/traverse'

import { head, isEmpty } from 'ramda'

import { getFormValues } from 'redux-form'
import {
	collectDefaults,
	rules,
	rulesFr,
	nestedSituationToPathMap,
	formatInputs
} from 'Engine/rules'

/* 
 *
 * We must here compute parsedRules, flatRules, analyse which contains both targets and cache objects
 *
 *
 * */

let langSelector = state => state.lang

export let flatRulesSelector = createSelector(
	[langSelector],
	lang => (lang === 'en' ? rules : rulesFr)
)

let parsedRulesSelector = createSelector([flatRulesSelector], rules =>
	parseAll(rules)
)

let ruleDefaultsSelector = createSelector([flatRulesSelector], rules =>
	collectDefaults(rules)
)

let targetNamesSelector = state => state.targetNames
export let situationSelector = getFormValues('conversation')

export let noUserInputSelector = createSelector(
	[situationSelector],
	situation => !situation || isEmpty(situation)
)

export let formattedSituationSelector = createSelector(
	[flatRulesSelector, situationSelector],
	(rules, situation) => formatInputs(rules, nestedSituationToPathMap(situation))
)

let situationWithDefaultsSelector = createSelector(
	[ruleDefaultsSelector, formattedSituationSelector],
	(defaults, situation) => ({ ...defaults, ...situation })
)

// Debounce this update as in the middleware now

let makeAnalysisSelector = withDefaults =>
	createSelector(
		[
			parsedRulesSelector,
			targetNamesSelector,
			withDefaults ? situationWithDefaultsSelector : formattedSituationSelector
		],
		(parsedRules, targetNames, situation) =>
			analyseMany(parsedRules, targetNames)(dottedName => situation[dottedName])
	)

export let analysisWithDefaultsSelector = makeAnalysisSelector(true)
let analysisWithoutDefaultsSelector = makeAnalysisSelector(false)

// TODO this should really not be fired twice in a user session...
//
// TODO the just input salary should be in the situation so that it is not a missing variable
let initialAnalysisSelector = createSelector(
	[parsedRulesSelector, targetNamesSelector],
	(parsedRules, targetNames) =>
		analyseMany(parsedRules, targetNames)(() => null)
)

let currentMissingVariablesByTargetSelector = createSelector(
	[analysisWithoutDefaultsSelector],
	analysis => collectMissingVariablesByTarget(analysis.targets)
)

export let missingVariablesByTargetSelector = createSelector(
	[initialAnalysisSelector, currentMissingVariablesByTargetSelector],
	(initialAnalysis, currentMissingVariablesByTarget) => ({
		initial: collectMissingVariablesByTarget(initialAnalysis.targets),
		current: currentMissingVariablesByTarget
	})
)

export let nextStepsSelector = createSelector(
	[currentMissingVariablesByTargetSelector],
	getNextSteps
)
export let currentQuestionSelector = createSelector(
	[nextStepsSelector],
	nextSteps => head(nextSteps)
)
