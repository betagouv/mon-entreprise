import { Equal, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estPlusGrandQue, eurosParAn } from '@/domaine/Montant'

import { compareRégimes } from './comparateur-régimes'
import { RegimeCotisation, SituationLocationCourteDuree } from './situation'

describe('compareRégimes', () => {
	describe('avec des recettes inférieures au seuil de professionnalisation', () => {
		it('marque tous les régimes comme non applicables', () => {
			const situation: SituationLocationCourteDuree = {
				recettes: eurosParAn(10_000),
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)

			résultats.forEach((régime) => {
				expect(régime.applicable).toBe(false)
				expect(
					!régime.applicable && régime.raisonDeNonApplicabilité
				).toBeDefined()
			})
		})
	})

	describe('avec des recettes au-dessus du seuil mais en-dessous du plafond', () => {
		it('marque tous les régimes comme applicables', () => {
			const situation: SituationLocationCourteDuree = {
				recettes: eurosParAn(40_000),
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)

			résultats.forEach((régime) => {
				expect(régime.applicable).toBe(true)
				expect('cotisations' in régime).toBe(true)
			})
		})

		it('calcule des valeurs de cotisations différentes pour chaque régime', () => {
			const situation: SituationLocationCourteDuree = {
				recettes: eurosParAn(40_000),
			}

			const résultats = compareRégimes(situation)

			const régimeGénéral = résultats.find((r) => r.régime === 'régime-général')
			const microEntreprise = résultats.find(
				(r) => r.régime === 'micro-entreprise'
			)
			const travailleurIndépendant = résultats.find(
				(r) => r.régime === 'travailleur-indépendant'
			)

			expect(régimeGénéral?.applicable).toBe(true)
			expect(microEntreprise?.applicable).toBe(true)
			expect(travailleurIndépendant?.applicable).toBe(true)

			if (
				régimeGénéral?.applicable &&
				microEntreprise?.applicable &&
				travailleurIndépendant?.applicable
			) {
				expect(
					Equal.equals(régimeGénéral.cotisations, microEntreprise.cotisations)
				).toBe(false)
				expect(
					Equal.equals(
						régimeGénéral.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
				expect(
					Equal.equals(
						microEntreprise.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
			}
		})
	})

	describe('avec des recettes supérieures au plafond du régime général', () => {
		it('devrait marquer le régime général comme non applicable', () => {
			const situation: SituationLocationCourteDuree = {
				recettes: eurosParAn(80_000),
			}

			const résultats = compareRégimes(situation)

			const régimeGénéral = résultats.find((r) => r.régime === 'régime-général')
			const microEntreprise = résultats.find(
				(r) => r.régime === 'micro-entreprise'
			)
			const travailleurIndépendant = résultats.find(
				(r) => r.régime === 'travailleur-indépendant'
			)

			expect(régimeGénéral?.applicable).toBe(false)
			expect(
				régimeGénéral &&
					!régimeGénéral.applicable &&
					régimeGénéral.raisonDeNonApplicabilité
			).toBeDefined()

			expect(microEntreprise?.applicable).toBe(true)
			expect(travailleurIndépendant?.applicable).toBe(true)
		})
	})

	describe('avec un régime spécifié', () => {
		it('devrait tout de même comparer tous les régimes', () => {
			const situation: SituationLocationCourteDuree = {
				recettes: eurosParAn(40_000),
				regimeCotisation: 'micro-entreprise' as RegimeCotisation,
			}

			const résultats = compareRégimes(situation)

			expect(résultats.length).toBe(3)
		})
	})

	describe('avec des paramètres supplémentaires', () => {
		it('devrait prendre en compte le paramètre estAlsaceMoselle', () => {
			const situationNormale: SituationLocationCourteDuree = {
				recettes: eurosParAn(40_000),
				estAlsaceMoselle: false,
			}

			const situationAlsaceMoselle: SituationLocationCourteDuree = {
				recettes: eurosParAn(40_000),
				estAlsaceMoselle: true,
			}

			const résultatsNormal = compareRégimes(situationNormale)
			const résultatsAlsaceMoselle = compareRégimes(situationAlsaceMoselle)

			const régimeGénéralNormal = résultatsNormal.find(
				(r) => r.régime === 'régime-général'
			)
			const régimeGénéralAlsaceMoselle = résultatsAlsaceMoselle.find(
				(r) => r.régime === 'régime-général'
			)

			expect(régimeGénéralNormal?.applicable).toBe(true)
			expect(régimeGénéralAlsaceMoselle?.applicable).toBe(true)

			if (
				régimeGénéralNormal?.applicable &&
				régimeGénéralAlsaceMoselle?.applicable
			) {
				expect(
					pipe(
						régimeGénéralAlsaceMoselle.cotisations,
						estPlusGrandQue(régimeGénéralNormal.cotisations)
					)
				).toBe(true)
			}
		})
	})
})
