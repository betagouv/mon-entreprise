import { RootState } from '@/store/reducers/rootReducer'

export const questionsRéponduesSelector = (state: RootState) =>
	state.simulation?.answeredQuestions ?? []
