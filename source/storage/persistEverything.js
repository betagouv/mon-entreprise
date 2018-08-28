/* @flow */

import type { Store } from 'redux'
import { debounce } from '../utils'
import type { State } from 'Types/State'
import type { Action } from 'Types/ActionsTypes'

const VERSION = 1

const LOCAL_STORAGE_KEY = 'mycompanyinfrance::persisted-everything:v' + VERSION

export function persistEverything(store: Store<State, Action>) {
	const listener = () => {
		const state = store.getState()
		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedState(): ?State {
	const serializedState = window.localStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? JSON.parse(serializedState) : null
}
