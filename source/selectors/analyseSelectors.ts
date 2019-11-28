import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'
import {
	collectDefaults,
	disambiguateExampleSituation,
	findRuleByDottedName
} from 'Engine/rules'
import { analyse, analyseMany, parseAll } from 'Engine/traverse'
import {
	add,
	defaultTo,
	difference,
	dissoc,
	equals,
	head,
	intersection,
	isEmpty,
	isNil,
	last,
	length,
	map,
	mergeDeepWith,
	negate,
	pick,
	pipe,
	sortBy,
	split,
	takeWhile,
	zipWith
} from 'ramda'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { DottedName } from 'Types/rule'
import { mapOrApply } from '../utils'
// create a "selector creator" that uses deep equal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

let configSelector = (state: RootState) =>
	(state.simulation && state.simulation.config) || {}

// We must here compute parsedRules, flatRules, analyse which contains both targets and cache objects
export let flatRulesSelector = (
	state: RootState,
	props?: { rules: RootState['rules'] }
) => {
	return (props && props.rules) || state.rules
}

export let parsedRulesSelector = createSelector([flatRulesSelector], rules =>
	parseAll(rules)
)

export let ruleDefaultsSelector = createSelector([flatRulesSelector], rules =>
	collectDefaults(rules)
)

export let targetNamesSelector = (state: RootState) => {
	let objectifs = configSelector(state).objectifs
	if (!objectifs || !Array.isArray(objectifs)) {
		return null
	}
	const targetNames = [].concat(
		...(objectifs as any).map(objectifOrGroup =>
			typeof objectifOrGroup === 'string'
				? [objectifOrGroup]
				: objectifOrGroup.objectifs
		)
	)

	const secondaryTargetNames =
		configSelector(state)['objectifs secondaires'] || []

	return [...targetNames, ...secondaryTargetNames]
}

type SituationSelectorType = typeof situationSelector

export const situationSelector = (state: RootState) =>
	(state.simulation && state.simulation.situation) || {}

export const useTarget = (dottedName: DottedName) => {
	const targets = useSelector(
		(state: RootState) => analysisWithDefaultsSelector(state).targets
	)
	return targets && targets.find(t => t.dottedName === dottedName)
}

export let noUserInputSelector = createSelector(
	[situationSelector],
	situation => !situation || isEmpty(dissoc('période', situation))
)

export let firstStepCompletedSelector = createSelector(
	[situationSelector, targetNamesSelector, parsedRulesSelector, configSelector],
	(situation, targetNames, parsedRules, config) => {
		if (!situation) {
			return true
		}
		const situations = Object.keys(situation)
		const allBlockingAreAnswered =
			config.bloquant &&
			config.bloquant.every(rule => situations.includes(rule))
		const targetIsAnswered =
			targetNames &&
			targetNames.some(targetName => {
				const rule = findRuleByDottedName(parsedRules, targetName)
				return rule && rule.formule && targetName in situation
			})
		return allBlockingAreAnswered || targetIsAnswered
	}
)

let validatedStepsSelector = createSelector(
	[state => state.conversationSteps.foldedSteps, targetNamesSelector],
	(foldedSteps, targetNames) => [...foldedSteps, ...targetNames]
)
const defaultUnitsSelector = (state: RootState) => state.simulation.defaultUnits
let branchesSelector = (state: RootState) => configSelector(state).branches
let configSituationSelector = (state: RootState) =>
	configSelector(state).situation || {}

const createSituationBrancheSelector = (
	situationSelector: SituationSelectorType
) =>
	createSelector(
		[situationSelector, branchesSelector, configSituationSelector],
		(situation, branches, configSituation) => {
			if (branches) {
				return branches.map(({ situation: branchSituation }) => ({
					...configSituation,
					...branchSituation,
					...situation
				}))
			}
			if (configSituation) {
				return { ...configSituation, ...situation }
			}
			return situation || {}
		}
	)

export let situationBranchesSelector = createSituationBrancheSelector(
	situationSelector
)
export let situationBranchNameSelector = createSelector(
	[branchesSelector, state => state.situationBranch],
	(branches, currentBranch) =>
		branches && !isNil(currentBranch) && branches[currentBranch].nom
)

export let validatedSituationSelector = createSelector(
	[situationSelector, validatedStepsSelector],
	(situation, validatedSteps) => pick(validatedSteps, situation)
)
export let validatedSituationBranchesSelector = createSituationBrancheSelector(
	validatedSituationSelector
)

export let situationsWithDefaultsSelector = createSelector(
	[ruleDefaultsSelector, situationBranchesSelector],
	(defaults, situations) =>
		mapOrApply(situation => ({ ...defaults, ...situation }), situations)
)

let analyseRule = (parsedRules, ruleDottedName, situationGate, defaultUnits) =>
	analyse(parsedRules, ruleDottedName, defaultUnits)(situationGate).targets[0]

export let ruleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, props) => props.dottedName,
		situationsWithDefaultsSelector,
		state => state.situationBranch || 0,
		defaultUnitsSelector
	],
	(rules, dottedName, situations, situationBranch, defaultUnits) => {
		return analyseRule(
			rules,
			dottedName,
			dottedName => {
				const currentSituation = Array.isArray(situations)
					? situations[situationBranch]
					: situations
				return currentSituation[dottedName]
			},
			defaultUnits
		)
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
		exampleSituationSelector,
		({ currentExample }) => currentExample
	],
	(rules, dottedName, situation, example) =>
		situation &&
		analyseRule(
			rules,
			dottedName,
			dottedName => situation[dottedName],
			example.defaultUnits
		)
)

let makeAnalysisSelector = (situationSelector: SituationSelectorType) =>
	createDeepEqualSelector(
		[
			parsedRulesSelector,
			targetNamesSelector,
			situationSelector,
			defaultUnitsSelector
		],
		(parsedRules, targetNames, situations, defaultUnits) =>
			mapOrApply(
				situation =>
					analyseMany(
						parsedRules,
						targetNames,
						defaultUnits
					)(dottedName => {
						return situation[dottedName]
					}),
				situations
			)
	)

export let analysisWithDefaultsSelector = makeAnalysisSelector(
	situationsWithDefaultsSelector
)

export let branchAnalyseSelector = createSelector(
	[
		analysisWithDefaultsSelector,
		(_, props) => props?.situationBranchName,
		branchesSelector
	],
	(analysedSituations, branchName, branches) => {
		if (!Array.isArray(analysedSituations) || !branchName || !branches) {
			return analysedSituations
		}
		const branchIndex = branches.findIndex(branch => branch.nom === branchName)
		return analysedSituations[branchIndex]
	}
)

let analysisValidatedOnlySelector = makeAnalysisSelector(
	validatedSituationBranchesSelector
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

const similarity = (rule1: DottedName, rule2: DottedName) =>
	pipe(
		map(defaultTo('')),
		map(split(' . ')),
		(rules: [string[], string[]]) => zipWith(equals, ...rules),
		takeWhile(Boolean),
		length,
		negate
	)([rule1, rule2])

export let nextStepsSelector = createSelector(
	[
		currentMissingVariablesByTargetSelector,
		configSelector,
		state => state.conversationSteps.foldedSteps,
		situationSelector
	],
	(
		mv,
		{
			questions: {
				'non prioritaires': notPriority = [],
				uniquement: only = null,
				'liste noire': blacklist = []
			} = {}
		},
		foldedSteps = [],
		situation
	) => {
		let nextSteps = difference(getNextSteps(mv), foldedSteps)

		if (only) nextSteps = intersection(nextSteps, [...only, ...notPriority])
		if (blacklist) {
			nextSteps = difference(nextSteps, blacklist)
		}

		// L'ajout de la réponse permet de traiter les questions dont la réponse est "une possibilité", exemple "contrat salarié . cdd"
		let lastStep = last(foldedSteps),
			lastStepWithAnswer = situation[lastStep]
				? [lastStep, situation[lastStep]].join(' . ')
				: lastStep

		nextSteps = sortBy(
			question =>
				similarity(question, lastStepWithAnswer) +
				notPriority.indexOf(question),
			nextSteps
		)

		return nextSteps
	}
)

export let currentQuestionSelector = createSelector(
	[nextStepsSelector, state => state.conversationSteps.unfoldedStep],
	(nextSteps, unfoldedStep) => unfoldedStep || head(nextSteps)
)
