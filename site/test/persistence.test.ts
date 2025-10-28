import { createMemoryHistory } from 'history'
import { createStore, Store, StoreEnhancer } from 'redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { setupSimulationPersistence } from '@/storage/persistSimulation'
import * as safeLocalStorage from '@/storage/safeLocalStorage'
import {
	chargeLaSimulationPrécédente,
	configureLaSimulation,
	enregistreLaRéponseÀLaQuestion,
} from '@/store/actions/actions'
import reducers, { SimulationConfig } from '@/store/reducers/rootReducer'
import { Simulation } from '@/store/reducers/simulation.reducer'

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
	questionsRépondues: [{ règle: 'somestep' as DottedName, applicable: true }],
	currentQuestion: null,
}

describe.skip('[persistence] When simulation persistence is setup', () => {
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
			store.dispatch(
				enregistreLaRéponseÀLaQuestion('dotted name' as DottedName, '42')
			)
			await delay(0)
		})
		it('saves state in localStorage with all fields', () => {
			expect(setItemSpy).toHaveBeenCalled()
			expect(setItemSpy.mock.calls[0]![1]).toBe(
				'{"situation":{"dotted name":"42"},"activeTargetInput":"sometargetinput","questionsRépondues":[{"règle":"somestep","applicable":true},{"règle":"dotted name","applicable":true}]}'
			)
		})
		it('saves state in localStorage with a key dependent on the simulation url', () => {
			expect(setItemSpy).toHaveBeenCalled()
			expect(setItemSpy.mock.calls[0]![0]).toContain('someurl')
		})
	})
})

describe.skip('[persistence] When simulation config is set', () => {
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
			configureLaSimulation(simulationConfig, history.location.pathname)
		)
	})
	describe('when previous simulation is loaded in state', () => {
		beforeEach(() => {
			store.dispatch(chargeLaSimulationPrécédente())
		})
		it('loads url in state', () => {
			expect(store.getState().simulation.url).toBe('/someotherurl')
		})
		it('loads situation in state', () => {
			expect(store.getState().simulation.situation).toEqual({
				'dotted name . other': '42',
			})
		})
		it('loads activeTargetInput in state', () => {
			expect(store.getState().activeTargetInput).toBe('someothertargetinput')
		})
		it('loads questionsRépondues in state', () => {
			expect(store.getState().simulation.questionsRépondues).toEqual([
				'someotherstep',
			])
		})
	})
})
