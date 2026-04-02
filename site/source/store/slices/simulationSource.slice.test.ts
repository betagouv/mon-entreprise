import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'

import {
	fermeLeBandeau,
	règleObsolèteDétectée,
	simulationChargéeDepuisLien,
	simulationSourceReducer,
	SimulationSourceState,
} from './simulationSource.slice'

const règleObsolète = 'dirigeant . auto-entrepreneur . éligible' as DottedName

describe('simulationSourceReducer', () => {
	it("est null à l'initialisation", () => {
		expect(simulationSourceReducer(undefined, { type: '@@INIT' })).toBeNull()
	})

	it("enregistre le chargement depuis un lien partagé sans règles ignorées", () => {
		const state = simulationSourceReducer(
			undefined,
			simulationChargéeDepuisLien([])
		)

		expect(state).toEqual({
			origine: 'lien-partagé',
			règlesObsolètes: [],
		})
	})

	it('enregistre le chargement depuis un lien partagé avec des règles ignorées', () => {
		const state = simulationSourceReducer(
			undefined,
			simulationChargéeDepuisLien([règleObsolète])
		)

		expect(state).toEqual({
			origine: 'lien-partagé',
			règlesObsolètes: [règleObsolète],
		})
	})

	it('ajoute une règle obsolète quand une source est active', () => {
		const initial: SimulationSourceState = {
			origine: 'sauvegarde',
			règlesObsolètes: [],
		}

		const state = simulationSourceReducer(
			initial,
			règleObsolèteDétectée(règleObsolète)
		)

		expect(state?.règlesObsolètes).toEqual([règleObsolète])
	})

	it("n'ajoute pas de règle obsolète quand aucune source n'est active", () => {
		const state = simulationSourceReducer(
			null,
			règleObsolèteDétectée(règleObsolète)
		)

		expect(state).toBeNull()
	})

	it('enregistre le chargement depuis une simulation précédente', () => {
		const state = simulationSourceReducer(undefined, {
			type: 'CHARGE_LA_SIMULATION_PRÉCÉDENTE',
		})

		expect(state).toEqual({
			origine: 'sauvegarde',
			règlesObsolètes: [],
		})
	})

	it('se réinitialise quand la simulation est reconfigurée', () => {
		const initial: SimulationSourceState = {
			origine: 'lien-partagé',
			règlesObsolètes: [],
		}

		const state = simulationSourceReducer(initial, {
			type: 'CONFIGURE_LA_SIMULATION',
			config: {},
			url: '/test',
			key: 'test',
		})

		expect(state).toBeNull()
	})

	it("se réinitialise quand l'utilisateur ferme le bandeau", () => {
		const initial: SimulationSourceState = {
			origine: 'sauvegarde',
			règlesObsolètes: [règleObsolète],
		}

		const state = simulationSourceReducer(initial, fermeLeBandeau())

		expect(state).toBeNull()
	})
})
