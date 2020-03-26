import Engine, { parseRules } from 'Engine'
import { getNextSteps } from 'Engine/generateQuestions'
import {
	collectDefaults,
	disambiguateRuleReference,
	splitName
} from 'Engine/ruleUtils'
import rules from 'Publicode/rules'
import {
	add,
	difference,
	equals,
	fromPairs,
	head,
	intersection,
	isNil,
	last,
	length,
	map,
	mergeDeepWith,
	negate,
	pick,
	pipe,
	sortBy,
	takeWhile,
	toPairs,
	zipWith
} from 'ramda'
import { useSelector } from 'react-redux'
import { RootState, Simulation } from 'Reducers/rootReducer'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { DottedName } from 'Types/rule'
import { mapOrApply } from '../utils'
// les variables dans les tests peuvent être exprimées relativement à l'espace de nom de la règle,
// comme dans sa formule
let disambiguateExampleSituation: any = (rules, rule) =>
	pipe(
		toPairs as any,
		map(([k, v]) => [
			disambiguateRuleReference(rules, rule.dottedName, k),
			v
		]) as any,
		fromPairs
	)
// create a "selector creator" that uses deep equal instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)

let configSelector = (state: RootState) => state.simulation?.config || {}

// We used to systematically put the rules in the Redux state but it broke hot
// reloading (the Redux store was re-created every time we changed the rules,
// and the situation was reseted). We now support both putting the rules in the
// state (for tests, library, etc.), and we default to a side-effect value (for
// hot-reloading on developement). See
// https://github.com/betagouv/mon-entreprise/issues/912
// TOTO
const rulesEn = rules
let flatRulesSelector = (state: RootState) =>
	state.rules ?? (state.lang === 'en' ? rulesEn : rules)

// We must here compute parsedRules, flatRules, analyse which contains both
// targets and cache objects
export let parsedRulesSelector = createSelector([flatRulesSelector], rules =>
	parseRules(rules)
)

export let ruleDefaultsSelector = createSelector(
	[parsedRulesSelector],
	parsedRules => collectDefaults(parsedRules)
)

export let targetNamesSelector = (state: RootState) => {
	let objectifs = configSelector(state).objectifs
	if (!objectifs || !Array.isArray(objectifs)) {
		return []
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

export let noUserInputSelector = (state: RootState) =>
	!Object.keys(situationSelector(state)).length

export let firstStepCompletedSelector = createSelector(
	[situationSelector, targetNamesSelector, parsedRulesSelector, configSelector],
	(situation, targetNames, parsedRules) => {
		if (!situation) {
			return true
		}
		const targetIsAnswered = targetNames?.some(targetName => {
			const rule = parsedRules[targetName]
			return rule?.formule && targetName in situation
		})
		return targetIsAnswered
	}
)

let validatedStepsSelector = createSelector(
	[state => state.simulation?.foldedSteps, targetNamesSelector],
	(foldedSteps, targetNames) => [...(foldedSteps || []), ...targetNames]
)
export const defaultUnitSelector = (state: RootState) =>
	state.simulation?.defaultUnit ?? '€/mois'
let branchesSelector = (state: RootState) => configSelector(state).branches
let configSituationSelector = (state: RootState) =>
	configSelector(state).situation || {}

const createSituationBrancheSelector = (
	situationSelector: SituationSelectorType
) =>
	createSelector(
		[situationSelector, branchesSelector, configSituationSelector],
		(
			situation,
			branches,
			configSituation
		): Simulation['situation'] | Array<Simulation['situation']> => {
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

let evaluateRule = (parsedRules, ruleDottedName, situation, defaultUnits) =>
	new Engine({ rules: parsedRules })
		.setDefaultUnits(defaultUnits)
		.setSituation(situation)
		.evaluate(ruleDottedName)

export let ruleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, props: { dottedName: DottedName }) => props.dottedName,
		situationBranchesSelector,
		state => state.situationBranch || 0,
		defaultUnitSelector
	],
	(rules, dottedName, situations, situationBranch, defaultUnit) => {
		return evaluateRule(
			rules,
			dottedName,
			Array.isArray(situations) ? situations[situationBranch] : situations,
			[defaultUnit]
		)
	}
)

let exampleSituationSelector = createSelector(
	[
		parsedRulesSelector,
		situationBranchesSelector,
		({ currentExample }) => currentExample
	],
	(rules, situations, example) =>
		example && {
			...(situations[0] || situations),
			...disambiguateExampleSituation(
				rules,
				rules[example.dottedName]
			)(example.situation)
		}
)
export let exampleAnalysisSelector = createSelector(
	[
		parsedRulesSelector,
		(_, props: { dottedName: DottedName }) => props.dottedName,
		exampleSituationSelector,
		({ currentExample }) => currentExample
	],
	(rules, dottedName, situation, example) =>
		situation &&
		evaluateRule(rules, dottedName, situation, example?.defaultUnit)
)

let makeAnalysisSelector = (
	situationSelector: SituationSelectorType,
	useDefaultValues
) =>
	createDeepEqualSelector(
		[
			parsedRulesSelector,
			targetNamesSelector,
			situationSelector,
			defaultUnitSelector
		],
		(parsedRules, targetNames, situations, defaultUnit) => {
			return mapOrApply(situation => {
				const engine = new Engine({ rules: parsedRules, useDefaultValues })
					.setSituation(situation)
					.setDefaultUnits([defaultUnit])
				return {
					targets: targetNames.map(target => engine.evaluate(target)),
					cache: engine.getCache(),
					controls: engine.controls()
				}
			}, situations)
		}
	)

export let analysisWithDefaultsSelector = makeAnalysisSelector(
	situationBranchesSelector as any,
	true
)

export let branchAnalyseSelector = createSelector(
	[
		analysisWithDefaultsSelector,
		(_, props: { situationBranchName: string }) => props?.situationBranchName,
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
	validatedSituationBranchesSelector as SituationSelectorType,
	false
)

let currentMissingVariablesByTargetSelector = createSelector(
	[analysisValidatedOnlySelector],
	analyses => {
		const variables = mapOrApply(
			analysis =>
				analysis.targets.reduce(
					(acc, target) => ({
						[target.dottedName]: target.missingVariables,
						...acc
					}),
					{}
				),
			analyses
		)
		if (Array.isArray(variables)) {
			return variables.reduce((acc, next) => mergeDeepWith(add)(acc, next), {})
		}

		return variables
	}
)

const similarity = (rule1: string = '', rule2: string = '') =>
	pipe(
		zipWith(equals),
		takeWhile(Boolean),
		length,
		negate
	)(splitName(rule1), splitName(rule2))

export let nextStepsSelector = createSelector(
	[
		currentMissingVariablesByTargetSelector,
		configSelector,
		(state: RootState) => state.simulation?.foldedSteps,
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
			lastStepWithAnswer =
				lastStep && situation[lastStep]
					? ([lastStep, situation[lastStep]].join(' . ') as DottedName)
					: lastStep

		nextSteps = sortBy(
			question =>
				notPriority.includes(question)
					? notPriority.indexOf(question)
					: similarity(question, lastStepWithAnswer),

			nextSteps
		)
		return nextSteps
	}
)

export let currentQuestionSelector = createSelector(
	[nextStepsSelector, state => state.simulation?.unfoldedStep],
	(nextSteps, unfoldedStep) => unfoldedStep || head(nextSteps)
)
