import { RootState } from '@/store/reducers/rootReducer'

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? {}
