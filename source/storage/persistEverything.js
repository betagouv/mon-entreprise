/* @flow */

import type { Store } from 'redux'
import { omit } from 'ramda'
import { debounce } from '../utils'
import safeLocalStorage from './safeLocalStorage'
import type { State } from 'Types/State'
import type { Action } from 'Types/ActionsTypes'

const VERSION = 2

const LOCAL_STORAGE_KEY = 'mycompanyinfrance::persisted-everything:v' + VERSION

type OptionsType = {
	except?: Array<string>
}
export const persistEverything = (options?: OptionsType = {}) => (
	store: Store<State, Action>
): void => {
	const listener = () => {
		const state = store.getState()
		safeLocalStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(omit(options.except || [], state))
		)
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedState(): ?State {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? JSON.parse(serializedState) : null
}
