import { Store } from 'redux'

import { Action } from '@/actions/actions'
import { RootState, Situation } from '@/reducers/rootReducer'

import { debounce } from '../utils'
import * as safeLocalStorage from './safeLocalStorage'

const VERSION = 4

const LOCAL_STORAGE_KEY = `mon-entreprise::companySituation::v${VERSION}`

export function setupCompanySituationPersistence(
	store: Store<RootState, Action>
) {
	const listener = () => {
		const state = store.getState()
		safeLocalStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(state.companySituation)
		)
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedCompanySituation() {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)

	return serializedState && serializedState !== 'undefined'
		? (JSON.parse(serializedState) as Situation)
		: undefined
}
