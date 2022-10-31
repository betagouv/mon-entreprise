import { useEngine } from '@/components/utils/EngineContext'
import { RootState, SimulationConfig, Situation } from '@/reducers/rootReducer'
import { DottedName } from 'modele-social'
import Engine, { utils } from 'publicodes'
import { useSelector } from 'react-redux'

export const configSelector = (state: RootState): Partial<SimulationConfig> =>
	state.simulation?.config ?? {}

const objectifsSelector = (state: RootState) => {
	const config = configSelector(state)

	const objectifs = [
		...(config.objectifs ?? []),
		...(config['objectifs cachés'] ?? []),
	]

	return objectifs
}

const emptySituation: Situation = {}

export const useMissingVariables = (): Partial<Record<DottedName, number>> => {
	const objectifs = useSelector(objectifsSelector)
	const engine = useEngine()

	return mergeObjectifsMissingVariable(
		objectifs.map(
			(objectif) => engine.evaluate(objectif).missingVariables ?? {}
		),
		engine
	)
}
export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const companySituationSelector = (state: RootState) =>
	state.companySituation

export const firstStepCompletedSelector = (state: RootState) => {
	const situation = situationSelector(state)

	return (
		Object.keys(situation).filter(
			// Hack to prevent questions from showing after selection 'IR or IS' in the toggle above simulator
			(dottedName) => dottedName !== 'entreprise . imposition'
		).length > 0
	)
}

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: RootState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: RootState) =>
	state.simulation?.foldedSteps ?? []

export const shouldFocusFieldSelector = (state: RootState) =>
	state.simulation?.shouldFocusField ?? false

/**
 * Merge objectifs missings that depends on the same input field.
 *
 * For instance, the commune field (API) will fill `commune . nom` `commune . taux versement transport`, `commune . département`, etc.
 */
function mergeObjectifsMissingVariable<Name extends string>(
	missingVariables: Array<Partial<Record<Name, number>>>,
	engine: Engine<Name>
): Partial<Record<Name, number>> {
	return (
		missingVariables.flatMap((missings) => Object.entries(missings)) as Array<
			[Name, number]
		>
	).reduce((missings, [name, value]: [Name, number]) => {
		const parentName = utils.ruleParent(name) as Name
		if (parentName && engine.getRule(parentName).rawNode.API) {
			missings[parentName] = (missings[parentName] ?? 0) + value

			return missings
		}
		missings[name] = value

		return missings
	}, {} as Partial<Record<Name, number>>)
}
