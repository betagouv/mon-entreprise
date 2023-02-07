import originalReduceReducers, {
	Action as OriginalAction,
	Reducer as OriginalReducer,
} from 'reduce-reducers'

type Reducer<S, A extends OriginalAction> = (state: S, action: A) => S

/**
 * Override reduceReducers function to add action type
 */
export const reduceReducers = <S, A extends OriginalAction>(
	...reducers: Reducer<S, A>[]
) => originalReduceReducers(...(reducers as OriginalReducer<S>[]))
