import { getInitialState, persistState } from 'Components/utils/persistState'
import React, { createContext, useCallback, useReducer } from 'react'

const StoreContext = createContext()

const StoreProvider = ({ children, reducer, localStorageKey }) => {
	const computeInitialState = useCallback(
		() => reducer(getInitialState(localStorageKey), { type: '@@INIT_STATE' }),
		[reducer]
	)

	const [state, dispatch] = (localStorageKey
		? persistState(localStorageKey)
		: x => x)(useReducer(reducer, undefined, computeInitialState))

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	)
}

export { StoreContext, StoreProvider }
