import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'

import { analyseMany, analyse, parseAll } from 'Engine/traverse'

import { head, isEmpty, pick, equals } from 'ramda'

import { getFormValues } from 'redux-form'
import {
	collectDefaults,
	rules as baseRulesEn,
	rulesFr as baseRulesFr,
	nestedSituationToPathMap,
	formatInputs,
	findRuleByDottedName,
	disambiguateExampleSituation
} from 'Engine/rules'

// create a "selector creator" that uses deep equal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

/* 
 *
 * We must here compute parsedRules, flatRules, analyse which contains both targets and cache objects
 *
 *
 * */

export let flatRulesSelector = createSelector(
	state => state.lang,
	(state, props) => props && props.rules,
	(lang, rules) => rules || (lang === 'en' ? baseRulesEn : baseRulesFr)
)

let parsedRulesSelector = createSelector([flatRulesSelector], rules =>
	parseAll(rules)
)

let ruleDefaultsSelector = createSelector([flatRulesSelector], rules =>
	collectDefaults(rules)
)

let targetNamesSelector = state => state.targetNames

export let situationSelector = createDeepEqualSelector(
	getFormValues('conversation'),
	x => x
)

export let noUserInputSelector = createSelector(
	[situationSelector],
	situation => !situation || isEmpty(situation)
)

export let formattedSituationSelector = createSelector(
	[flatRulesSelector, situationSelector],
	(rules, situation) => formatInputs(rules, nestedSituationToPathMap(situation))
)

let validatedStepsSelector = createSelector(
	[
		state => state.conversationSteps.foldedSteps,
		state => state.activeTargetInput
	],
	(foldedSteps, target) => [...foldedSteps, target]
)

export let validatedSituationSelector = createSelector(
	[formattedSituationSelector, validatedStepsSelector],
	(situation, validatedSteps) => pick(validatedSteps, situation)
)

let situationWithDefaultsSelector = createSelector(
	[ruleDefaultsSelector, formattedSituationSelector],
	(defaults, situation) => ({ ...defaults, ...situation })
)

let analyseRule = (parsedRules, ruleDottedName, situation) =>
	situation &&
	analyse(parsedRules, ruleDottedName)(dottedName => situation[dottedName])
		.targets[0]

export let ruleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, { dottedName }) => dottedName,
		situationWithDefaultsSelector
	],
	analyseRule
)

let exampleSituationSelector = createSelector(
	[
		parsedRulesSelector,
		situationWithDefaultsSelector,
		({ currentExample }) => currentExample
	],
	(rules, situation, example) =>
		example && {
			...situation,
			...disambiguateExampleSituation(
				rules,
				findRuleByDottedName(rules, example.dottedName)
			)(example.situation)
		}
)
export let exampleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, { dottedName }) => dottedName,
		exampleSituationSelector
	],
	analyseRule
)

let makeAnalysisSelector = situationSelector =>
	createDeepEqualSelector(
		[parsedRulesSelector, targetNamesSelector, situationSelector],
		(parsedRules, targetNames, situation) =>
			analyseMany(parsedRules, targetNames)(dottedName => situation[dottedName])
	)

export let analysisWithDefaultsSelector = makeAnalysisSelector(
	situationWithDefaultsSelector
)
let analysisValidatedOnlySelector = makeAnalysisSelector(
	validatedSituationSelector
)

// TODO this should really not be fired twice in a user session...
//
// TODO the just input salary should be in the situation so that it is not a missing variable
let initialAnalysisSelector = createSelector(
	[parsedRulesSelector, targetNamesSelector],
	(parsedRules, targetNames) =>
		analyseMany(parsedRules, targetNames)(() => null)
)

let currentMissingVariablesByTargetSelector = createSelector(
	[analysisValidatedOnlySelector],
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
