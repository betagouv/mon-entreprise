import React, { createContext, useReducer, useEffect } from 'react'
import { reducer, initialState } from './reducers'

const StoreContext = createContext(initialState)

const StoreProvider = ({ children }) => {
	// Set up reducer with useReducer and our defined reducer, initialState from reducers.js
	const [state, dispatch] = useReducer(reducer, initialState)

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	)
}

export { StoreContext, StoreProvider }
