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
	difference,
	dissoc,
	equals,
	head,
	intersection,
	isEmpty,
	mergeDeepWith,
	pick
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

const mapOrApply = (fn, x) => (Array.isArray(x) ? x.map(fn) : fn(x))

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
	situation => !situation || isEmpty(dissoc('période', situation))
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
let branchesSelector = state => state.simulationConfig?.branches
let configSituationSelector = state => state.simulationConfig?.situation || {}

const createSituationBrancheSelector = situationSelector =>
	createSelector(
		[situationSelector, branchesSelector, configSituationSelector],
		(situation, branches, configSituation) => {
			if (branches) {
				return branches.map(({ situation: branchSituation }) => ({
					...situation,
					...configSituation.situation,
					...branchSituation
				}))
			}
			if (configSituation) {
				return { ...situation, ...configSituation }
			}
			return situation
		}
	)

export let situationBranchesSelector = createSituationBrancheSelector(
	formattedSituationSelector
)
export let situationBranchNameSelector = createSelector(
	[branchesSelector, state => state.situationBranch],
	(branches, currentBranch) =>
		branches && currentBranch && branches[currentBranch].nom
)

export let validatedSituationSelector = createSelector(
	[formattedSituationSelector, validatedStepsSelector],
	(situation, validatedSteps) => pick(validatedSteps, situation)
)
export let validatedSituationBranchesSelector = createSituationBrancheSelector(
	validatedSituationSelector
)

let situationsWithDefaultsSelector = createSelector(
	[ruleDefaultsSelector, situationBranchesSelector],
	(defaults, situations) =>
		mapOrApply(situation => ({ ...defaults, ...situation }), situations)
)

let analyseRule = (parsedRules, ruleDottedName, situationGate) =>
	analyse(parsedRules, ruleDottedName)(situationGate).targets[0]

export let ruleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, props) => props.dottedName,
		situationsWithDefaultsSelector,
		state => state.situationBranch || 0
	],
	(rules, dottedName, situations, situationBranch) => {
		return analyseRule(rules, dottedName, dottedName => {
			const currentSituation = Array.isArray(situations)
				? situations[situationBranch]
				: situations
			return currentSituation[dottedName]
		})
	}
)

let exampleSituationSelector = createSelector(
	[
		parsedRulesSelector,
		situationsWithDefaultsSelector,
		({ currentExample }) => currentExample
	],
	(rules, situations, example) =>
		example && {
			...(situations[0] || situations),
			...disambiguateExampleSituation(
				rules,
				findRuleByDottedName(rules, example.dottedName)
			)(example.situation)
		}
)
export let exampleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, props) => props.dottedName,
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
			(_, props) => props?.situationBranchName,
			branchesSelector
		],
		(parsedRules, targetNames, situations, branchName, branches) => {
			const analysedSituations = mapOrApply(
				situation =>
					analyseMany(parsedRules, targetNames)(dottedName => {
						return situation[dottedName]
					}),
				situations
			)
			if (!Array.isArray(analysedSituations) || !branchName || !branches) {
				return analysedSituations
			}
			const branchIndex = branches.findIndex(
				branch => branch.nom === branchName
			)
			return analysedSituations[branchIndex]
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
	analyses => {
		const variables = mapOrApply(
			analysis => collectMissingVariablesByTarget(analysis.targets),
			analyses
		)
		if (Array.isArray(variables)) {
			return variables.reduce((acc, next) => mergeDeepWith(add)(acc, next), {})
		}
		return variables
	}
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
		state => state.simulationConfig?.questions,
		state => state.simulationConfig?.objectifs
	],
	(mv, questions) => {
		let nextSteps = getNextSteps(mv)

		if (questions && questions.blacklist) {
			return difference(nextSteps, questions.blacklist)
		}
		if (questions) {
			return intersection(nextSteps, questions)
		}
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
