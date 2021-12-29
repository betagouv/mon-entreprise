import { useEffect, useState } from 'react'
import safeLocalStorage from '../../storage/safeLocalStorage'

export const getInitialState = (key: string) => {
	const value = safeLocalStorage.getItem(key)
	if (value === 'undefined' || !value) {
		return
	}
	try {
		return JSON.parse(value)
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e)
		return null
	}
}

export const useSafeLocaleStorage = (key: string, state: any) => {
	useEffect(() => {
		if (key) {
			safeLocalStorage.setItem(key, JSON.stringify(state))
		}
	}, [key, state])
}

export const usePersistingState = <S>(key: string, defaultState?: any) => {
	const persistedState = getInitialState(key)
	const initialState = persistedState != null ? persistedState : defaultState
	const [state, setState] = useState<S>(initialState)
	useSafeLocaleStorage(key, state)
	return [state, setState] as const
}
