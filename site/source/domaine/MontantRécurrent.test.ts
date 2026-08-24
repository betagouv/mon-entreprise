import { Either, Equal, pipe } from 'effect'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { fois, Montant } from './Montant'
import { euros } from './MontantPonctuel'
import {
	estPlusGrandOuÉgalÀ,
	estPlusGrandQue,
	estPlusPetitOuÉgalÀ,
	estPlusPetitQue,
	eurosParAn,
	eurosParMois,
	moins,
	parRapportÀ,
	plus,
	pourcentageParRapportÀ,
	sommeEnEurosParAn,
	sommeEnEurosParMois,
} from './MontantRécurrent'

describe('MontantRécurrent', () => {
	describe('opérations', () => {
		it('additionne correctement deux montants de même unité', () => {
			const montant1 = eurosParMois(100)
			const montant2 = eurosParMois(50)
			const resultat = plus(montant1, montant2)
			expect(Equal.equals(resultat, eurosParMois(150))).toBe(true)
		})

		it('soustrait correctement deux montants de même unité', () => {
			const montant1 = eurosParAn(100)
			const montant2 = eurosParAn(50)
			const resultat = moins(montant1, montant2)
			expect(Equal.equals(resultat, eurosParAn(50))).toBe(true)
		})

		it('additionne un montant récurrent d’une autre unité en le convertissant vers l’unité de la cible', () => {
			const parAn = eurosParAn(1000)
			const parMois = eurosParMois(100)

			const enAnnuel = plus(parAn, parMois)
			expect(Equal.equals(enAnnuel, eurosParAn(2200))).toBe(true)

			const enMensuel = pipe(parMois, plus(parAn))
			expect(Equal.equals(enMensuel, eurosParMois(183.33))).toBe(true)
		})

		it('soustrait un montant récurrent d’une autre unité en le convertissant vers l’unité de la cible', () => {
			const chiffreDAffaires = eurosParMois(10000)
			const charges = eurosParAn(24000)

			const enMensuel = pipe(chiffreDAffaires, moins(charges))
			expect(Equal.equals(enMensuel, eurosParMois(8000))).toBe(true)

			const enAnnuel = moins(charges, chiffreDAffaires)
			expect(Equal.equals(enAnnuel, eurosParAn(-96000))).toBe(true)
		})

		it('interdit à la compilation de mélanger montants ponctuels et récurrents', () => {
			const vérificationsDeTypes = () => {
				// @ts-expect-error mélange d’unités interdit
				plus(euros(100), eurosParMois(10))
				// @ts-expect-error mélange d’unités interdit
				moins(eurosParAn(100), euros(10))
			}

			expect(vérificationsDeTypes).toBeDefined()
		})

		it('calcule le rapport entre montants récurrents d’unités différentes', () => {
			const rapport = parRapportÀ(eurosParMois(500), eurosParAn(12000))

			expect(Either.getOrThrow(rapport)).toBeCloseTo(0.5, 5)
		})

		it('interdit à la compilation le rapport entre un montant ponctuel et un récurrent', () => {
			const vérificationsDeTypes = () => {
				// @ts-expect-error mélange d’unités interdit
				parRapportÀ(euros(50), eurosParAn(100))
				// @ts-expect-error mélange d’unités interdit
				pourcentageParRapportÀ(eurosParMois(50), euros(100))
			}

			expect(vérificationsDeTypes).toBeDefined()
		})

		it('somme correctement plusieurs montants en €/mois et retourne un résultat en €/mois', () => {
			const montants = [eurosParMois(200), eurosParMois(300), eurosParMois(500)]
			const resultat = sommeEnEurosParMois(montants)
			expect(Equal.equals(resultat, eurosParMois(1000))).toBe(true)
			expect(resultat.unité).toBe('€/mois')
		})

		it('somme correctement plusieurs montants en €/mois et retourne un résultat en €/an', () => {
			const montants = [eurosParMois(200), eurosParMois(300), eurosParMois(500)]
			const resultat = sommeEnEurosParAn(montants)
			expect(Equal.equals(resultat, eurosParAn(12000))).toBe(true)
			expect(resultat.unité).toBe('€/an')
		})

		it('permet la composition avec pipe', () => {
			const montant = eurosParMois(100)

			// Chaînage d'opérations: (100€/mois + 50€/mois) * 2
			const resultat = pipe(montant, plus(eurosParMois(50)), fois(2))

			expect(Equal.equals(resultat, eurosParMois(300))).toBe(true)
		})

		it('conserve le type du montant', () => {
			const centEurosParMois = eurosParMois(100)
			const resultat = plus(centEurosParMois, eurosParMois(50))

			expectTypeOf<typeof resultat>().toMatchTypeOf<Montant<'€/mois'>>()
		})
	})

	describe('comparaisons', () => {
		it('comparer correctement deux montants de même unité', () => {
			const montant1 = eurosParAn(100)
			const montant2 = eurosParAn(50)
			expect(estPlusGrandQue(montant1, montant2)).toBe(true)
			expect(estPlusPetitQue(montant2, montant1)).toBe(true)
			expect(Equal.equals(montant1, montant1)).toBe(true)
			expect(Equal.equals(montant1, montant2)).toBe(false)
		})

		it('vérifie correctement les égalités et inégalités', () => {
			const montant1 = eurosParMois(100)
			const montant2 = eurosParMois(100)
			const montant3 = eurosParMois(150)

			expect(Equal.equals(montant1, montant2)).toBe(true)
			expect(Equal.equals(montant1, montant3)).toBe(false)
			expect(estPlusGrandOuÉgalÀ(montant1, montant2)).toBe(true)
			expect(estPlusPetitOuÉgalÀ(montant1, montant2)).toBe(true)
			expect(estPlusPetitQue(montant1, montant3)).toBe(true)
			expect(estPlusGrandQue(montant3, montant1)).toBe(true)
		})

		it('permet la composition avec pipe pour les comparaisons', () => {
			const montant1 = eurosParAn(100)
			const montant2 = eurosParAn(50)

			const supérieur = pipe(montant1, estPlusGrandQue(montant2))
			expect(supérieur).toBe(true)

			const inférieur = pipe(montant2, estPlusPetitQue(montant1))
			expect(inférieur).toBe(true)
		})

		it('compare des montants récurrents d’unités différentes en les convertissant', () => {
			const milleParMois = eurosParMois(1000)
			const sixMilleParAn = eurosParAn(6000)

			expect(estPlusGrandQue(milleParMois, sixMilleParAn)).toBe(true)
			expect(estPlusPetitQue(sixMilleParAn, milleParMois)).toBe(true)
			expect(pipe(sixMilleParAn, estPlusPetitOuÉgalÀ(eurosParMois(500)))).toBe(
				true
			)
			expect(estPlusGrandOuÉgalÀ(eurosParMois(500), sixMilleParAn)).toBe(true)
		})

		it('interdit à la compilation de comparer montants ponctuels et récurrents', () => {
			const vérificationsDeTypes = () => {
				// @ts-expect-error mélange d’unités interdit
				estPlusGrandQue(euros(100), eurosParMois(10))
				// @ts-expect-error mélange d’unités interdit
				estPlusPetitQue(eurosParAn(100), euros(10))
			}

			expect(vérificationsDeTypes).toBeDefined()
		})
	})
})
