import { Action } from 'Actions/actions'
import { RootState } from 'Reducers/rootReducer'
import { Store } from 'redux'
import { PreviousSimulation } from 'Selectors/previousSimulationSelectors'
import { debounce } from '../utils'
import * as safeLocalStorage from './safeLocalStorage'
import { deserialize, serialize } from './serializeSimulation'

const VERSION = 5

const localStorageKey = (pathname: string) =>
	`mon-entreprise::persisted-simulation::v${VERSION}::${pathname}`

export function setupSimulationPersistence(
	store: Store<RootState, Action>,
	debounceDelay = 1000
) {
	const listener = () => {
		const state = store.getState()
		if (!state.simulation?.url) return
		if (!state.simulation?.foldedSteps.length) return
		safeLocalStorage.setItem(
			localStorageKey(state.simulation.url),
			serialize(state)
		)
	}
	store.subscribe(debounce(debounceDelay, listener))
}

export function retrievePersistedSimulation(
	simulationUrl: string
): PreviousSimulation | null {
	const serializedState = safeLocalStorage.getItem(
		localStorageKey(simulationUrl)
	)
	return serializedState ? deserialize(serializedState) : null
}
