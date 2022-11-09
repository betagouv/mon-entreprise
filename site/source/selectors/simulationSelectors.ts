import { DottedName } from 'modele-social'
import Engine, { utils } from 'publicodes'
import { useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { RootState, Situation } from '@/reducers/rootReducer'

export const configSelector = (state: RootState) =>
	state.simulation?.config ?? {}

export const configObjectifsSelector = (state: RootState) => {
	const config = configSelector(state)

	const objectifs = [
		...(config['objectifs exclusifs'] ?? []),
		...(config.objectifs ?? []),
	]

	return objectifs
}

const emptySituation: Situation = {}

export const useMissingVariables = ({
	engines,
}: {
	engines: Array<Engine<DottedName>>
}): Partial<Record<DottedName, number>> => {
	const objectifs = useSelector(configObjectifsSelector)

	return treatAPIMissingVariables(
		objectifs
			.flatMap((objectif) =>
				engines.map((e) => e.evaluate(objectif).missingVariables ?? {})
			)
			.reduce(mergeMissing, {}),
		useEngine()
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
function treatAPIMissingVariables<Name extends string>(
	missingVariables: Partial<Record<Name, number>>,
	engine: Engine<Name>
): Partial<Record<Name, number>> {
	return (Object.entries(missingVariables) as Array<[Name, number]>).reduce(
		(missings, [name, value]: [Name, number]) => {
			const parentName = utils.ruleParent(name) as Name
			if (parentName && engine.getRule(parentName).rawNode.API) {
				missings[parentName] = (missings[parentName] ?? 0) + value

				return missings
			}
			missings[name] = value

			return missings
		},
		{} as Partial<Record<Name, number>>
	)
}
const mergeMissing = (
	left: Record<string, number> | undefined = {},
	right: Record<string, number> | undefined = {}
): Record<string, number> =>
	Object.fromEntries(
		[...Object.keys(left), ...Object.keys(right)].map((key) => [
			key,
			(left[key] ?? 0) + (right[key] ?? 0),
		])
	)
