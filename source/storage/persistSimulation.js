/* @flow */

import type { Store } from 'redux'
import { debounce } from '../utils'
import safeLocalStorage from './safeLocalStorage'
import { deserialize, serialize } from './serializeSimulation'
import type { State, SavedSimulation } from '../types/State'
import type { Action } from 'Types/ActionsTypes'

const VERSION = 2

const LOCAL_STORAGE_KEY = 'embauche.gouv.fr::persisted-simulation::v' + VERSION

export function persistSimulation(store: Store<State, Action>) {
	const listener = () => {
		const state = store.getState()
		if (!state.conversationSteps.foldedSteps.length) {
			return
		}
		safeLocalStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedSimulation(): ?SavedSimulation {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? deserialize(serializedState) : null
}

export function deletePersistedSimulation(): void {
	safeLocalStorage.removeItem(LOCAL_STORAGE_KEY)
}
