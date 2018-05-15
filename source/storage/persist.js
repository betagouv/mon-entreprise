/* @flow */

import type { Store } from 'redux'
import { serialize, deserialize } from './serialize'
import type { State } from '../types/State'
import type { Action } from '../types/Action'

const VERSION = 1

function throttle(timeout: number, fn: () => void): () => void {
	let timeoutId
	return (...args) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), timeout)
	}
}

const LOCAL_STORAGE_KEY = 'embauche.gouv.fr::persisted-simulation::v' + VERSION

export function persistState(store: Store<State, Action>) {
	const listener = () => {
		const state = store.getState()
		if (!state.conversationStarted) {
			return
		}
		window.localStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
	}
	if (retrievePersistedState()) {
		store.dispatch({
			type: 'LOAD_PREVIOUS_SIMULATION'
		})
	}
	store.subscribe(throttle(1000, listener))
}

export function retrievePersistedState(): ?State {
	const serializedState = window.localStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? deserialize(serializedState) : null
}
