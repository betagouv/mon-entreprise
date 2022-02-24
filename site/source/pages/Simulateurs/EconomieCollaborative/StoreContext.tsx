import {
	useSafeLocaleStorage,
	getInitialState,
} from '~/components/utils/persistState'
import {
	Dispatch,
	ReducerAction,
	ReducerState,
	createContext,
	useCallback,
	useReducer,
	ReactNode,
} from 'react'
import reducer, { State } from './reducer'

interface Context {
	state: ReducerState<typeof reducer> | null
	dispatch: Dispatch<ReducerAction<typeof reducer>> | null
}

const StoreContext = createContext<Context>({
	state: null,
	dispatch: null,
})

interface StoreProviderProps {
	children: ReactNode
	localStorageKey: string
}

const StoreProvider = ({ children, localStorageKey }: StoreProviderProps) => {
	const computeInitialState = useCallback(
		() =>
			reducer(getInitialState<State>(localStorageKey) ?? {}, {
				type: '@@INIT_STATE',
			}),
		[localStorageKey]
	)
	const [state, dispatch] = useReducer(reducer, undefined, computeInitialState)
	useSafeLocaleStorage(localStorageKey, state)

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	)
}

export { StoreContext, StoreProvider }
