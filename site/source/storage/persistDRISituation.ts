import { Action } from '@/actions/actions'

import { RootState, Situation } from '@/reducers/rootReducer'
import { Store } from 'redux'
import { debounce } from '../utils'
import * as safeLocalStorage from './safeLocalStorage'

const VERSION = 1

const LOCAL_STORAGE_KEY = `mon-entreprise::DRISituation::v${VERSION}`

export function setupDRISituationPersistence(store: Store<RootState, Action>) {
	const listener = () => {
		const state = store.getState()
		safeLocalStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(state.DRISituation)
		)
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedDRISituation(): Situation | undefined {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)

	return serializedState && serializedState !== 'undefined'
		? (JSON.parse(serializedState) as Situation)
		: undefined
}
