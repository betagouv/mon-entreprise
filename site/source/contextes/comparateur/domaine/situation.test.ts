import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'
import { pourcentage } from '@/domaine/Quantite'

import {
	estSituationValide,
	initialSituationComparée,
	simulationEstCommencée,
} from './situation'

const avec = (champs: Partial<typeof initialSituationComparée>) => ({
	...initialSituationComparée,
	...champs,
})

describe('estSituationValide', () => {
	it('est valide avec un chiffre d’affaires et une imposition au barème', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
		})

		expect(estSituationValide(situation)).toBe(true)
	})

	it('est valide avec un chiffre d’affaires et un taux d’imposition personnalisé', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
			méthodeImposition: 'taux personnalisé',
			tauxImposition: O.some(pourcentage(18)),
		})

		expect(estSituationValide(situation)).toBe(true)
	})

	it('est valide même sans charges', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
			charges: O.none(),
		})

		expect(estSituationValide(situation)).toBe(true)
	})

	it('est invalide sans chiffre d’affaires', () => {
		expect(estSituationValide(initialSituationComparée)).toBe(false)
	})

	it('est invalide sans taux d’imposition personnalisé', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
			méthodeImposition: 'taux personnalisé',
		})

		expect(estSituationValide(situation)).toBe(false)
	})
})

describe('simulationEstCommencée', () => {
	it('est vraie avec un chiffre d’affaires', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
		})

		expect(simulationEstCommencée(situation)).toBe(true)
	})

	it('est vraie avec des charges', () => {
		const situation = avec({
			charges: O.some(eurosParAn(45_000)),
		})

		expect(simulationEstCommencée(situation)).toBe(true)
	})

	it('est fausse sans chiffre d’affaires ni charges', () => {
		const situation = avec({
			chiffreDAffaires: O.none(),
			charges: O.none(),
		})

		expect(simulationEstCommencée(situation)).toBe(false)
	})

	it('est fausse pour la situation initiale', () => {
		expect(simulationEstCommencée(initialSituationComparée)).toBe(false)
	})
})
