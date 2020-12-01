import { expect } from 'chai'
import * as sinon from 'sinon'
import { createStore } from 'redux'
import { createMemoryHistory } from 'history'

import { DottedName } from 'modele-social'
import reducers, {
	Simulation,
	SimulationConfig,
} from '../source/reducers/rootReducer'
import { PreviousSimulation } from '../source/selectors/previousSimulationSelectors'
import safeLocalStorage from '../source/storage/safeLocalStorage'
import { setupSimulationPersistence } from '../source/storage/persistSimulation'
import {
	loadPreviousSimulation,
	updateSituation,
	setSimulationConfig,
} from '../source/actions/actions'

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

const simulationConfig: SimulationConfig = {
	objectifs: [],
	'objectifs cachés': [],
	situation: {},
	'unité par défaut': '€/mois',
}
const initialSimulation: Simulation = {
	config: simulationConfig,
	url: '/someurl',
	hiddenNotifications: [],
	situation: {},
	initialSituation: {},
	targetUnit: '€/mois',
	foldedSteps: ['somestep' as DottedName],
	unfoldedStep: null,
}

describe('[persistence] When simulation persistence is setup', () => {
	const sandbox = sinon.createSandbox()
	let spiedSafeLocalStorage
	let store

	beforeEach(() => {
		spiedSafeLocalStorage = sandbox.spy(safeLocalStorage as any)
		store = createStore(reducers, {
			simulation: initialSimulation,
			activeTargetInput: 'sometargetinput',
		})

		setupSimulationPersistence(store, 0)
	})
	afterEach(() => {
		sandbox.restore()
	})

	describe('when the state is changed with some data that is persistable', () => {
		beforeEach(async () => {
			store.dispatch(updateSituation('dotted name' as DottedName, '42'))
			await delay(0)
		})
		it('saves state in localStorage with all fields', () => {
			expect(spiedSafeLocalStorage.setItem.calledOnce).to.be.true
			expect(spiedSafeLocalStorage.setItem.getCall(0).args[1]).to.eq(
				'{"situation":{"dotted name":"42"},"activeTargetInput":"sometargetinput","foldedSteps":["somestep"]}'
			)
		})
		it('saves state in localStorage with a key dependent on the simulation url', () => {
			expect(spiedSafeLocalStorage.setItem.calledOnce).to.be.true
			expect(spiedSafeLocalStorage.setItem.getCall(0).args[0]).to.contain(
				'someurl'
			)
		})
	})
})

describe('[persistence] When simulation config is set', () => {
	// const previousSimulation: PreviousSimulation = {
	// 	situation: { 'dotted name': '42' },
	// 	activeTargetInput: 'sometargetinput',
	// 	foldedSteps: ['somestep' as DottedName],
	// }
	const serializedPreviousSimulation =
		'{"situation":{"dotted name . other":"42"},"activeTargetInput":"someothertargetinput","foldedSteps":["someotherstep"]}'

	const sandbox = sinon.createSandbox()
	let store

	beforeEach(() => {
		sandbox
			.stub(safeLocalStorage, 'getItem')
			.callsFake(() => serializedPreviousSimulation)
		store = createStore(reducers)
		const history = createMemoryHistory()
		history.replace('/someotherurl')

		setSimulationConfig(simulationConfig, false)(
			store.dispatch,
			store.getState,
			{ history: history, sitePaths: null }
		)
	})
	afterEach(() => {
		sandbox.restore()
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
