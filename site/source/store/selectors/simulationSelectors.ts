import { DottedName } from 'modele-social'
import { utils } from 'publicodes'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import { usePromise } from '@/hooks/usePromise'
// import { useEngine } from '@/components/utils/EngineContext'
import { RootState, Situation } from '@/store/reducers/rootReducer'
import {
	useWorkerEngine,
	WorkerEngine,
} from '@/worker/socialWorkerEngineClient'

export const configSelector = (state: RootState) =>
	state.simulation?.config ?? {}

export const configObjectifsSelector = createSelector(
	[
		(state: RootState) => configSelector(state)['objectifs exclusifs'],
		(state: RootState) => configSelector(state).objectifs,
	],
	(objectifsExclusifs, objectifs) => [
		...(objectifsExclusifs ?? []),
		...(objectifs ?? []),
	]
)

const emptySituation: Situation = {}

export const useMissingVariables = (
	workerEngines?: WorkerEngine[]
): Partial<Record<DottedName, number>> => {
	const objectifs = useSelector(configObjectifsSelector)
	const workerEngine = useWorkerEngine()

	return usePromise(
		async () => {
			const evaluates = await Promise.all(
				objectifs.flatMap((objectif) =>
					(workerEngines ?? [workerEngine]).map(
						async (e) =>
							(await e.asyncEvaluateWithEngineId(objectif)).missingVariables ??
							{}
					)
				)
			)

			return await treatAPIMissingVariables(
				evaluates.reduce(mergeMissing, {}),
				workerEngine
			)
		},
		[objectifs, workerEngine, workerEngines],
		{}
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
async function treatAPIMissingVariables(
	missingVariables: Partial<Record<DottedName, number>>,
	workerEngine: WorkerEngine
): Promise<Partial<Record<DottedName, number>>> {
	return (
		await Promise.all(
			(Object.entries(missingVariables) as [DottedName, number][]).map(
				async ([name, value]) => {
					const parentName = utils.ruleParent(name) as DottedName
					const rule =
						parentName &&
						(await workerEngine.asyncGetRuleWithEngineId(parentName))

					return [name, value, parentName, rule.rawNode.API] as const
				}
			)
		)
	).reduce(
		(missings, [name, value, parentName, API]) => {
			if (API) {
				missings[parentName] = (missings[parentName] ?? 0) + value

				return missings
			}
			missings[name] = value

			return missings
		},
		{} as Partial<Record<DottedName, number>>
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
