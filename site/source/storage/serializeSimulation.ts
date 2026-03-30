import { currentSimulationSelector } from '@/store/selectors/simulation/currentSimulation.selector'

import { sanitizePersistedSituation } from './sanitizePersistedSituation'

export const serialize = (
	...args: Parameters<typeof currentSimulationSelector>
) => JSON.stringify(currentSimulationSelector(...args))

export const deserialize = (serialized: string) => {
	const parsed = JSON.parse(serialized)

	return parsed?.situation
		? { ...parsed, situation: sanitizePersistedSituation(parsed.situation) }
		: parsed
}
