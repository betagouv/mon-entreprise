import { Action } from 'Actions/actions'
import { Unit } from 'Engine/units'
import originRules from 'Publicode/rules'
import { defaultTo, identity, omit, without } from 'ramda'
import reduceReducers from 'reduce-reducers'
import { combineReducers, Reducer } from 'redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { DottedName, Rules } from 'Types/rule'
import i18n, { AvailableLangs } from '../i18n'
import { areUnitConvertible, convertUnit, parseUnit } from './../engine/units'
import inFranceAppReducer, { Company } from './inFranceAppReducer'
import storageRootReducer from './storageReducer'

function rules(state: Rules = originRules) {
	return state
}

function explainedVariable(
	state: DottedName | null = null,
	action: Action
): DottedName | null {
	switch (action.type) {
		case 'EXPLAIN_VARIABLE':
			return action.variableName
		case 'STEP_ACTION':
			return null
		default:
			return state
	}
}

type Example = null | {
	name: string
	situation: object
	dottedName: DottedName
	defaultUnit?: Unit
}

function currentExample(state: Example = null, action: Action): Example {
	switch (action.type) {
		case 'SET_EXAMPLE':
			return action.name != null ? action : null
		default:
			return state
	}
}

function situationBranch(state: number | null = null, action: Action) {
	switch (action.type) {
		case 'SET_SITUATION_BRANCH':
			return action.id
		default:
			return state
	}
}

function activeTargetInput(state: DottedName | null = null, action: Action) {
	switch (action.type) {
		case 'SET_ACTIVE_TARGET_INPUT':
			return action.name
		case 'RESET_SIMULATION':
			return null
		default:
			return state
	}
}

function lang(
	state = i18n.language as AvailableLangs,
	{ type, lang }
): AvailableLangs {
	switch (type) {
		case 'SWITCH_LANG':
			return lang
		default:
			return state
	}
}

function goalsFromAnalysis(analysis) {
	return (
		analysis &&
		(Array.isArray(analysis) ? analysis[0] : analysis).targets
			.map(target => target.explanation || target)
			.filter(target => !!target.formule == !!target.question)
			.map(({ dottedName }) => dottedName)
	)
}

function updateSituation(
	situation,
	{
		fieldName,
		value,
		analysis
	}: {
		fieldName: DottedName
		value: any
		analysis: any
	}
) {
	const goals = goalsFromAnalysis(analysis)
	const removePreviousTarget = goals?.includes(fieldName)
		? omit(goals)
		: identity
	return { ...removePreviousTarget(situation), [fieldName]: value }
}

function updateDefaultUnit(situation, { toUnit, analysis }) {
	const unit = parseUnit(toUnit)
	const goals = goalsFromAnalysis(analysis)
	const convertedSituation = Object.keys(situation)
		.map(
			dottedName =>
				analysis.targets.find(target => target.dottedName === dottedName) ||
				analysis.cache[dottedName]
		)
		.filter(
			rule =>
				rule.dottedName === 'entreprise . charges' || // HACK en attendant de revoir le fonctionnement des unités
				(goals?.includes(rule.dottedName) &&
					(rule.unit || rule.defaultUnit) &&
					!rule.unité &&
					areUnitConvertible(rule.unit || rule.defaultUnit, unit))
		)
		.reduce(
			(convertedSituation, rule) => ({
				...convertedSituation,
				[rule.dottedName]: convertUnit(
					rule.unit || rule.defaultUnit,
					unit,
					situation[rule.dottedName]
				)
			}),
			situation
		)
	return convertedSituation
}

type QuestionsKind =
	| "à l'affiche"
	| 'non prioritaires'
	| 'uniquement'
	| 'liste noire'

export type SimulationConfig = Partial<{
	objectifs:
		| Array<DottedName>
		| Array<{ icône: string; nom: string; objectifs: Array<DottedName> }>
	questions: Partial<Record<QuestionsKind, Array<DottedName>>>
	bloquant: Array<DottedName>
	situation: Simulation['situation']
	branches: Array<{ nom: string; situation: SimulationConfig['situation'] }>
	'unité par défaut': string
}>

type Situation = Partial<Record<DottedName, any>>
export type Simulation = {
	config: SimulationConfig
	url: string
	hiddenControls: Array<string>
	situation: Situation
	initialSituation: Situation
	defaultUnit: string
	foldedSteps: Array<DottedName>
	unfoldedStep?: DottedName | null
}
function getCompanySituation(company: Company): Situation {
	return {
		...(company?.localisation && {
			'établissement . localisation': JSON.stringify(company.localisation)
		}),
		...(company?.dateDeCréation && {
			'entreprise . date de création': company.dateDeCréation.replace(
				/(.*)-(.*)-(.*)/,
				'$3/$2/$1'
			)
		})
	}
}

function simulation(
	state: Simulation | null = null,
	action: Action,
	analysis: any,
	existingCompany: Company
): Simulation | null {
	if (action.type === 'SET_SIMULATION') {
		const companySituation = action.useCompanyDetails
			? getCompanySituation(existingCompany)
			: {}
		const { config, url } = action
		if (state && state.config === config) {
			return state
		}
		return {
			config,
			url,
			hiddenControls: [],
			situation: companySituation,
			initialSituation: companySituation,
			defaultUnit: config['unité par défaut'] || '€/mois',
			foldedSteps: Object.keys(companySituation) as Array<DottedName>,
			unfoldedStep: null
		}
	}
	if (state === null) {
		return state
	}

	switch (action.type) {
		case 'HIDE_CONTROL':
			return { ...state, hiddenControls: [...state.hiddenControls, action.id] }
		case 'RESET_SIMULATION':
			return {
				...state,
				hiddenControls: [],
				situation: state.initialSituation,
				foldedSteps: [],
				unfoldedStep: null
			}
		case 'UPDATE_SITUATION':
			return {
				...state,
				situation: updateSituation(state.situation, {
					fieldName: action.fieldName,
					value: action.value,
					analysis
				})
			}
		case 'STEP_ACTION':
			const { name, step } = action
			if (name === 'fold')
				return {
					...state,
					foldedSteps: [...state.foldedSteps, step],
					unfoldedStep: null
				}
			if (name === 'unfold') {
				return {
					...state,
					foldedSteps: without([step], state.foldedSteps),
					unfoldedStep: step
				}
			}
			return state
		case 'UPDATE_DEFAULT_UNIT':
			return {
				...state,
				situation: updateDefaultUnit(state.situation, {
					toUnit: action.defaultUnit,
					analysis
				}),
				defaultUnit: action.defaultUnit
			}
	}
	return state
}
const existingCompanyReducer = (state, action: Action) => {
	if (action.type.startsWith('EXISTING_COMPANY::') && state.simulation) {
		return {
			...state,
			simulation: {
				...state.simulation,
				situation: {
					...state.simulation.situation,
					...getCompanySituation(state.inFranceApp.existingCompany)
				}
			}
		}
	}
	return state
}
const mainReducer = (state, action: Action) =>
	combineReducers({
		lang,
		rules,
		explainedVariable,
		// We need to access the `rules` in the simulation reducer
		simulation: (a: Simulation | null = null, b: Action): Simulation | null =>
			simulation(
				a,
				b,
				a && analysisWithDefaultsSelector(state),
				state.inFranceApp?.existingCompany
			),
		previousSimulation: defaultTo(null) as Reducer<SavedSimulation | null>,
		currentExample,
		situationBranch,
		activeTargetInput,
		inFranceApp: inFranceAppReducer
	})(state, action)

export default reduceReducers<RootState>(
	mainReducer as any,
	existingCompanyReducer as any,
	storageRootReducer as any
) as Reducer<RootState>

export type RootState = ReturnType<typeof mainReducer>
