import { RootState } from '@/store/reducers/rootReducer'

export const previousSimulationSelector = (state: RootState) =>
	state.previousSimulation
