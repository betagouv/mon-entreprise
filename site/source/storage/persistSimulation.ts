import { Action } from '@/actions/actions'
import { RootState } from '@/reducers/rootReducer'
import { PreviousSimulation } from '@/selectors/previousSimulationSelectors'
import { isEmpty } from 'ramda'
import { Store } from 'redux'
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
		if (!state.simulation?.url) {
			return
		}
		if (isEmpty(state.simulation?.situation)) {
			return
		}
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
