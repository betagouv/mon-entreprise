import { Action } from 'Actions/actions'
import { RootState } from 'Reducers/rootReducer'
import { Store } from 'redux'
import { SavedSimulation } from 'Selectors/storageSelectors'
import { debounce } from '../utils'
import safeLocalStorage from './safeLocalStorage'
import { deserialize, serialize } from './serializeSimulation'

const VERSION = 4

const LOCAL_STORAGE_KEY = 'embauche.gouv.fr::persisted-simulation::v' + VERSION

export function persistSimulation(store: Store<RootState, Action>) {
	const listener = () => {
		const state = store.getState()
		if (!state.simulation?.foldedSteps.length) {
			return
		}
		safeLocalStorage.setItem(LOCAL_STORAGE_KEY, serialize(state))
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedSimulation(): SavedSimulation {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? deserialize(serializedState) : null
}

export function deletePersistedSimulation(): void {
	safeLocalStorage.removeItem(LOCAL_STORAGE_KEY)
}
