import { useEffect, useState } from 'react'

import * as safeLocalStorage from '../../storage/safeLocalStorage'

type Storage = Record<string, unknown> | boolean | number | null

export const getInitialState = <T extends Storage>(key: string): T | null => {
	const value = safeLocalStorage.getItem(key)
	if (value === 'undefined' || !value) {
		return null
	}
	try {
		return JSON.parse(value) as T
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e)

		return null
	}
}

export const useSafeLocaleStorage = <T extends Storage>(
	key: string,
	state: T
) => {
	useEffect(() => {
		if (key) {
			safeLocalStorage.setItem(key, JSON.stringify(state))
		}
	}, [key, state])
}

export const usePersistingState = <T extends Storage>(
	key: string,
	defaultState: T
) => {
	const persistedState = getInitialState<T>(key)
	const initialState = persistedState != null ? persistedState : defaultState
	const [state, setState] = useState<T>(initialState)
	useSafeLocaleStorage(key, state)

	return [state, setState] as const
}
