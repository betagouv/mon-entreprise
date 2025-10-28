import { currentSimulationSelector } from '@/store/selectors/simulation/currentSimulation.selector'

export const serialize = (
	...args: Parameters<typeof currentSimulationSelector>
) => JSON.stringify(currentSimulationSelector(...args))

export const deserialize = JSON.parse
