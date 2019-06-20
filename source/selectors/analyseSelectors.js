import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'
import {
	collectDefaults,
	disambiguateExampleSituation,
	findRuleByDottedName,
	nestedSituationToPathMap,
	rules as baseRulesEn,
	rulesFr as baseRulesFr
} from 'Engine/rules'
import { analyse, analyseMany, parseAll } from 'Engine/traverse'
import {
	add,
	defaultTo,
	propEq,
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
import { getFormValues } from 'redux-form'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { mapOrApply } from '../utils'
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

export let targetNamesSelector = state => {
	let objectifs = state.simulation?.config.objectifs
	if (!objectifs || !Array.isArray(objectifs)) {
		return null
	}
	const targetNames = [].concat(
		...objectifs.map(objectifOrGroup =>
			typeof objectifOrGroup === 'string'
				? [objectifOrGroup]
				: objectifOrGroup.objectifs
		)
	)

	const secondaryTargetNames =
		state.simulation?.config['objectifs secondaires'] || []

	return [targetNames, secondaryTargetNames]
}

export let situationSelector = createDeepEqualSelector(
	getFormValues('conversation'),
	x => x
)

export let formattedSituationSelector = createSelector(
	[situationSelector],
	situation => nestedSituationToPathMap(situation)
)

export let noUserInputSelector = createSelector(
	[formattedSituationSelector],
	situation => !situation || isEmpty(dissoc('période', situation))
)

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

let validatedStepsSelector = createSelector(
	[
		state => state.conversationSteps.foldedSteps,
		state => state.activeTargetInput
	],
	(foldedSteps, target) => [...foldedSteps, target]
)
let branchesSelector = state => state.simulation?.config.branches
let configSituationSelector = state => state.simulation?.config.situation || {}

const createSituationBrancheSelector = situationSelector =>
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
	formattedSituationSelector
)
export let situationBranchNameSelector = createSelector(
	[branchesSelector, state => state.situationBranch],
	(branches, currentBranch) =>
		branches && !isNil(currentBranch) && branches[currentBranch].nom
)

export let validatedSituationSelector = createSelector(
	[formattedSituationSelector, validatedStepsSelector],
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
		[parsedRulesSelector, targetNamesSelector, situationSelector],
		(parsedRules, targetNames, situations) =>
			mapOrApply(
				situation =>
					analyseMany(parsedRules, targetNames)(dottedName => {
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

const similarity = rule1 => rule2 =>
	pipe(
		map(defaultTo('')),
		map(split(' . ')),
		rules => zipWith(equals, ...rules),
		takeWhile(Boolean),
		length,
		negate
	)([rule1, rule2])

export let nextStepsSelector = createSelector(
	[
		currentMissingVariablesByTargetSelector,
		state => state.simulation?.config.questions,
		state => state.conversationSteps.foldedSteps
	],
	(
		mv,
		{
			'non prioritaires': notPriority = [],
			uniquement: only,
			'liste noire': blacklist = []
		} = {},
		foldedSteps = []
	) => {
		let nextSteps = difference(getNextSteps(mv), foldedSteps)

		if (only) nextSteps = intersection(nextSteps, [...only, ...notPriority])
		if (blacklist) {
			nextSteps = difference(nextSteps, blacklist)
		}

		nextSteps = sortBy(similarity(last(foldedSteps)), nextSteps)
		if (notPriority) {
			nextSteps = sortBy(question => notPriority.indexOf(question), nextSteps)
		}
		return nextSteps
	}
)

export let currentQuestionSelector = createSelector(
	[nextStepsSelector, state => state.conversationSteps.unfoldedStep],
	(nextSteps, unfoldedStep) => unfoldedStep || head(nextSteps)
)

export let getRuleFromAnalysis = analysis => dottedName => {
	if (!analysis) {
		throw new Error("[getRuleFromAnalysis] The analysis can't be nil !")
	}
	let rule =
		analysis.cache[dottedName] ||
		analysis.targets.find(propEq('dottedName', dottedName))

	if (!rule) {
		throw new Error(
			`[getRuleFromAnalysis] Unable to find the rule ${dottedName}`
		)
	}

	return rule
}
