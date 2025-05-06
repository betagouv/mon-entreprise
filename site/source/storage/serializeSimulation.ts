import { currentSimulationSelector } from '@/store/selectors/previousSimulationSelectors'

export const serialize = (
	...args: Parameters<typeof currentSimulationSelector>
) => JSON.stringify(currentSimulationSelector(...args))

export const deserialize = JSON.parse
