import { useEffect, useState } from 'react'
import safeLocalStorage from '../../storage/safeLocalStorage'

export const persistState = (key: string) => ([state, changeState]) => {
	useEffect(() => {
		safeLocalStorage.setItem(key, JSON.stringify(state))
		return
	}, [state])
	return [state, changeState]
}

export const getInitialState = (key: string) => {
	const value = safeLocalStorage.getItem(key)
	if (!value) {
		return
	}
	try {
		return JSON.parse(value)
	} catch (e) {
		console.warn(e)
		return null
	}
}

export const usePersistingState = (key: string, defaultState?: any) => {
	const initialState = getInitialState(key)
	return persistState(key)(
		useState(initialState != null ? initialState : defaultState)
	)
}
