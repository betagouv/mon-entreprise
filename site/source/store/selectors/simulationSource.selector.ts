import { RootState } from '@/store/reducers/rootReducer'

export const simulationSourceSelector = (state: RootState) =>
	state.simulationSource
