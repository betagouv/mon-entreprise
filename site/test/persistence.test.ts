import { createMemoryHistory } from 'history'
import { DottedName } from 'modele-social'
import { createStore, Store, StoreEnhancer } from 'redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setupSimulationPersistence } from '@/storage/persistSimulation'
import * as safeLocalStorage from '@/storage/safeLocalStorage'
import {
	loadPreviousSimulation,
	setSimulationConfig,
	updateSituation,
} from '@/store/actions/actions'
import reducers, {
	Simulation,
	SimulationConfig,
} from '@/store/reducers/rootReducer'

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

const simulationConfig: SimulationConfig = {
	'objectifs exclusifs': [],
	objectifs: [],
	situation: {},
	'unité par défaut': '€/mois',
}
const initialSimulation: Simulation = {
	config: simulationConfig,
	url: '/someurl',
	hiddenNotifications: [],
	situation: {},
	targetUnit: '€/mois',
	foldedSteps: ['somestep' as DottedName],
	unfoldedStep: null,
	shouldFocusField: false,
}

describe('[persistence] When simulation persistence is setup', () => {
	let store: Store
	const setItemSpy = vi.spyOn(safeLocalStorage, 'setItem')

	beforeEach(() => {
		store = createStore(reducers, {
			simulation: initialSimulation,
			activeTargetInput: 'sometargetinput',
		} as unknown as StoreEnhancer)

		setupSimulationPersistence(store, 0)
	})

	describe('when the state is changed with some data that is persistable', () => {
		beforeEach(async () => {
			store.dispatch(updateSituation('dotted name' as DottedName, '42'))
			await delay(0)
		})
		it('saves state in localStorage with all fields', () => {
			expect(setItemSpy).toHaveBeenCalled()
			expect(setItemSpy.mock.calls[0]![1]).to.equal(
				'{"situation":{"dotted name":"42"},"activeTargetInput":"sometargetinput","foldedSteps":["somestep"]}'
			)
		})
		it('saves state in localStorage with a key dependent on the simulation url', () => {
			expect(setItemSpy).toHaveBeenCalled()
			expect(setItemSpy.mock.calls[0]![0]).to.contain('someurl')
		})
	})
})

describe('[persistence] When simulation config is set', () => {
	const serializedPreviousSimulation =
		'{"situation":{"dotted name . other":"42"},"activeTargetInput":"someothertargetinput","foldedSteps":["someotherstep"]}'

	let store: Store

	vi.spyOn(safeLocalStorage, 'getItem').mockReturnValue(
		serializedPreviousSimulation
	)

	beforeEach(() => {
		store = createStore(reducers)
		const history = createMemoryHistory()
		history.replace('/someotherurl')

		store.dispatch(
			setSimulationConfig(simulationConfig, history.location.pathname)
		)
	})
	describe('when previous simulation is loaded in state', () => {
		beforeEach(() => {
			store.dispatch(loadPreviousSimulation())
		})
		it('loads url in state', () => {
			expect(store.getState().simulation.url).to.eq('/someotherurl')
		})
		it('loads situation in state', () => {
			expect(store.getState().simulation.situation).to.deep.eq({
				'dotted name . other': '42',
			})
		})
		it('loads activeTargetInput in state', () => {
			expect(store.getState().activeTargetInput).to.eq('someothertargetinput')
		})
		it('loads foldedSteps in state', () => {
			expect(store.getState().simulation.foldedSteps).to.deep.eq([
				'someotherstep',
			])
		})
	})
})
