import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'
import {
	collectDefaults,
	disambiguateExampleSituation,
	findRuleByDottedName,
	formatInputs,
	nestedSituationToPathMap,
	rules as baseRulesEn,
	rulesFr as baseRulesFr
} from 'Engine/rules'
import { analyse, analyseMany, parseAll } from 'Engine/traverse'
import {
	add,
	contains,
	dissoc,
	equals,
	head,
	intersection,
	isEmpty,
	map,
	mergeDeepWith,
	pick,
	pipe,
	reduce
} from 'ramda'
import { getFormValues } from 'redux-form'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'

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

export let parsedRulesSelector = createSelector(
	[flatRulesSelector],
	rules => parseAll(rules)
)

export let ruleDefaultsSelector = createSelector(
	[flatRulesSelector],
	rules => collectDefaults(rules)
)

let targetNamesSelector = state => state.simulationConfig?.objectifs

export let situationSelector = createDeepEqualSelector(
	getFormValues('conversation'),
	x => x
)

export let noUserInputSelector = createSelector(
	[situationSelector],
	situation =>
		!situation ||
		console.log(situation) ||
		isEmpty(dissoc('période', situation))
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
let branchesSelector = state => state.simulationConfig?.branches || [{}]

let situationBranchesSelector = createSelector(
	[formattedSituationSelector, branchesSelector],
	(situation, branches) =>
		branches.map(({ situation: branchSituation }) => ({
			...situation,
			...branchSituation
		}))
)
export let validatedSituationSelector = createSelector(
	[formattedSituationSelector, validatedStepsSelector],
	(situation, validatedSteps) => pick(validatedSteps, situation)
)
export let validatedSituationBranchesSelector = createSelector(
	[validatedSituationSelector, branchesSelector],
	(situation, branches) =>
		branches.map(({ situation: branchSituation }) => ({
			...situation,
			...branchSituation
		}))
)

let situationsWithDefaultsSelector = createSelector(
	[ruleDefaultsSelector, situationBranchesSelector],
	(defaults, situations) =>
		situations.map(situation => ({ ...defaults, ...situation }))
)

let analyseRule = (parsedRules, ruleDottedName, situationGate) =>
	analyse(parsedRules, ruleDottedName)(situationGate).targets[0]

let shortcutsSelector = state => state.simulationConfig?.raccourcis || [{}]

export let ruleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, { dottedName }) => dottedName,
		situationsWithDefaultsSelector,
		state => state.situationBranch || 0,
		shortcutsSelector
	],
	(rules, dottedName, situations, situationBranch, valueShortcuts) =>
		analyseRule(
			rules,
			dottedName,
			dottedName =>
				situations[situationBranch][valueShortcuts[dottedName] || dottedName]
		)
)

let exampleSituationSelector = createSelector(
	[
		parsedRulesSelector,
		situationsWithDefaultsSelector,
		({ currentExample }) => currentExample
	],
	(rules, situations, example) =>
		example && {
			...situations[0],
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
	(rules, dottedName, situation) =>
		situation &&
		analyseRule(rules, dottedName, dottedName => situation[dottedName])
)

let makeAnalysisSelector = situationSelector =>
	createDeepEqualSelector(
		[
			parsedRulesSelector,
			targetNamesSelector,
			situationSelector,
			shortcutsSelector
		],
		(parsedRules, targetNames, situations, valueShortcuts) => {
			let analyses = situations.map(situation =>
				analyseMany(parsedRules, targetNames)(
					dottedName => situation[valueShortcuts[dottedName] || dottedName]
				)
			)
			return analyses
		}
	)

export let analysisWithDefaultsSelector = makeAnalysisSelector(
	situationsWithDefaultsSelector
)
let analysisValidatedOnlySelector = makeAnalysisSelector(
	validatedSituationBranchesSelector
)

export let blockingInputControlsSelector = state => {
	let analysis = analysisWithDefaultsSelector(state)
	return analysis && analysis.blockingInputControls
}

export let validInputEnteredSelector = createSelector(
	[noUserInputSelector, blockingInputControlsSelector],
	(noUserInput, blockingInputControls) => !noUserInput && !blockingInputControls
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
	analyses =>
		pipe(
			map(analysis => collectMissingVariablesByTarget(analysis.targets)),
			reduce((memo, next) => mergeDeepWith(add)(memo, next), {})
		)(analyses)
)

export let missingVariablesByTargetSelector = createSelector(
	[initialAnalysisSelector, currentMissingVariablesByTargetSelector],
	(initialAnalysis, currentMissingVariablesByTarget) => ({
		initial: collectMissingVariablesByTarget(initialAnalysis.targets),
		current: currentMissingVariablesByTarget
	})
)

export let nextStepsSelector = createSelector(
	[
		currentMissingVariablesByTargetSelector,
		state => state.simulationConfig?.questions
	],
	(mv, questions) => {
		let nextSteps = getNextSteps(mv)
		if (questions) return intersection(nextSteps, questions)
		return nextSteps
	}
)
export let currentQuestionSelector = createSelector(
	[
		nextStepsSelector,
		state => state.conversationSteps.unfoldedStep,
		state => state.conversationSteps.priorityNamespace
	],
	(nextSteps, unfoldedStep, priorityNamespace) =>
		unfoldedStep ||
		(priorityNamespace && nextSteps.find(contains(priorityNamespace))) ||
		head(nextSteps)
)
