import { Store } from 'redux'

import { Action } from '@/actions/actions'
import { ChoixStatutJuridiqueState } from '@/reducers/choixStatutJuridiqueReducer'
import { RootState } from '@/reducers/rootReducer'

import { debounce } from '../utils'
import * as safeLocalStorage from './safeLocalStorage'

const VERSION = 7

const LOCAL_STORAGE_KEY = `mon-entreprise::persisted-infranceapp::v${VERSION}`

export function setupChoixStatutJuridiquePersistence(
	store: Store<RootState, Action>
) {
	const listener = () => {
		const state = store.getState()
		safeLocalStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(state.choixStatutJuridique)
		)
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedChoixStatutJuridique(): ChoixStatutJuridiqueState {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)

	return serializedState && serializedState !== 'undefined'
		? JSON.parse(serializedState)
		: undefined
}
