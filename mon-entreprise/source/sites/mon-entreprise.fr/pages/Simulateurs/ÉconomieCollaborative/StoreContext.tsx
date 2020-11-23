import {
	useSafeLocaleStorage,
	getInitialState
} from 'Components/utils/persistState'
import { Reducer } from 'react'
import { createContext, useCallback, useReducer, ReactNode } from 'react'

const StoreContext = createContext<{
	state: any
	dispatch: any
}>({ state: null, dispatch: null })

type StoreProviderProps = {
	children: ReactNode
	reducer: Reducer<any, any>
	localStorageKey: string
}

const StoreProvider = ({
	children,
	reducer,
	localStorageKey
}: StoreProviderProps) => {
	const computeInitialState = useCallback(
		() => reducer(getInitialState(localStorageKey), { type: '@@INIT_STATE' }),
		[reducer]
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
