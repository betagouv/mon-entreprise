import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { eurosParAn } from '@/domaine/Montant'
import { pourcentage, quantité } from '@/domaine/Quantite'

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
	it('est valide avec un chiffre d’affaires', () => {
		const situation = avec({
			chiffreDAffaires: O.some(eurosParAn(45_000)),
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
})

describe('simulationEstCommencée', () => {
	it.each([
		['chiffreDAffaires', O.some(eurosParAn(10_000))],
		['charges', O.some(eurosParAn(10_000))],
		['IRouIS', 'IS'],
		['versementLibératoire', true],
		['natureActivité', 'artisanale'],
		['typeActivité', 'service'],
		['activitéLibéraleRéglementée', true],
		['acre', true],
		['tva', false],
		['méthodeImposition', 'taux personnalisé'],
		['tauxImposition', O.some(pourcentage(10))],
		['situationFamiliale', 'couple'],
		['enfants', quantité(1, 'enfant')],
		['parentIsolé', true],
		['enfants', eurosParAn(10_000)],
	])(
		'est vraie si %s est différent de la situation initialie',
		(élément, valeur) => {
			const situation = avec({
				[élément]: valeur,
			})

			expect(simulationEstCommencée(situation)).toBe(true)
		}
	)

	it('est fausse pour la situation initiale', () => {
		expect(simulationEstCommencée(initialSituationComparée)).toBe(false)
	})
})
