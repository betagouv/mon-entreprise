import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'

import {
	fermeLeBandeau,
	simulationChargéeDepuisLien,
	simulationSourceReducer,
	SimulationSourceState,
} from './simulationSource.slice'

const règleIgnorée = 'dirigeant . auto-entrepreneur . éligible' as DottedName

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
			règlesIgnorées: [],
		})
	})

	it('enregistre le chargement depuis un lien partagé avec des règles ignorées', () => {
		const state = simulationSourceReducer(
			undefined,
			simulationChargéeDepuisLien([règleIgnorée])
		)

		expect(state).toEqual({
			origine: 'lien-partagé',
			règlesIgnorées: [règleIgnorée],
		})
	})

	it("ajoute une règle ignorée quand une source est active", () => {
		const initial: SimulationSourceState = {
			origine: 'sauvegarde',
			règlesIgnorées: [],
		}

		const state = simulationSourceReducer(initial, {
			type: 'SUPPRIME_LA_RÈGLE_DE_LA_SITUATION',
			fieldName: règleIgnorée,
		})

		expect(state?.règlesIgnorées).toEqual([règleIgnorée])
	})

	it("n'ajoute pas de règle ignorée quand aucune source n'est active", () => {
		const state = simulationSourceReducer(null, {
			type: 'SUPPRIME_LA_RÈGLE_DE_LA_SITUATION',
			fieldName: règleIgnorée,
		})

		expect(state).toBeNull()
	})

	it('enregistre le chargement depuis une simulation précédente', () => {
		const state = simulationSourceReducer(undefined, {
			type: 'CHARGE_LA_SIMULATION_PRÉCÉDENTE',
		})

		expect(state).toEqual({
			origine: 'sauvegarde',
			règlesIgnorées: [],
		})
	})

	it('se réinitialise quand la simulation est reconfigurée', () => {
		const initial: SimulationSourceState = {
			origine: 'lien-partagé',
			règlesIgnorées: [],
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
			règlesIgnorées: [règleIgnorée],
		}

		const state = simulationSourceReducer(initial, fermeLeBandeau())

		expect(state).toBeNull()
	})
})
