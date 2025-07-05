import { Either, Equal, pipe } from 'effect'
import { isLeft } from 'effect/Either'
import { describe, expect, expectTypeOf, it } from 'vitest'

import {
	diviséPar,
	DivisionParZéro,
	estNégatif,
	estPlusGrandOuÉgalÀ,
	estPlusGrandQue,
	estPlusPetitOuÉgalÀ,
	estPlusPetitQue,
	estPositif,
	estZéro,
	euros,
	eurosParAn,
	eurosParMois,
	fois,
	moins,
	Montant,
	plus,
	toString,
} from './Montant'

describe('Montant', () => {
	describe('constructeurs', () => {
		it('crée correctement un montant en euros', () => {
			const montant = euros(100)
			expect(toString(montant)).toBe('100 €')
			expect(montant.unité).toBe('€')
			expect(Equal.equals(montant, euros(100))).toBe(true)
		})

		it('crée correctement un montant en euros par mois', () => {
			const montant = eurosParMois(100)
			expect(montant.unité).toBe('€/mois')
			expect(toString(montant)).toBe('100 €/mois')
		})

		it('crée correctement un montant en euros annuels', () => {
			const montant = eurosParAn(100)
			expect(montant.unité).toBe('€/an')
			expect(toString(montant)).toBe('100 €/an')
		})

		it('arrondi automatiquement au centime', () => {
			const montant = euros(100.123)
			expect(Equal.equals(montant, euros(100.12))).toBe(true)

			const montant2 = euros(100.125)
			expect(Equal.equals(montant2, euros(100.13))).toBe(true)
		})
	})

	describe('opérations', () => {
		it('additionne correctement deux montants de même unité', () => {
			const montant1 = euros(100)
			const montant2 = euros(50)
			const resultat = plus(montant1, montant2)
			expect(Equal.equals(resultat, euros(150))).toBe(true)
			expect(resultat.unité).toBe('€')
		})

		it('soustrait correctement deux montants de même unité', () => {
			const montant1 = eurosParAn(100)
			const montant2 = eurosParAn(50)
			const resultat = moins(montant1, montant2)
			expect(Equal.equals(resultat, eurosParAn(50))).toBe(true)
			expect(resultat.unité).toBe('€/an')
		})

		it('multiplie correctement un montant par un scalaire', () => {
			const montant = euros(100)
			const resultat = fois(montant, 2)
			expect(Equal.equals(resultat, euros(200))).toBe(true)
			expect(resultat.unité).toBe('€')
		})

		it('divise correctement un montant par un scalaire non nul', () => {
			const montant = euros(100)
			const resultatEither = diviséPar(montant, 2)
			expect(Either.isRight(resultatEither)).toBe(true)
			if (Either.isRight(resultatEither)) {
				expect(Equal.equals(resultatEither.right, euros(50))).toBe(true)
				expect(resultatEither.right.unité).toBe('€')
			}
		})

		it("retourne une erreur lors d'une division par zéro", () => {
			const montant = euros(100)
			const resultatEither = diviséPar(montant, 0)
			expect(Either.isLeft(resultatEither)).toBe(true)
			if (Either.isLeft(resultatEither)) {
				expect(resultatEither.left).toBeInstanceOf(DivisionParZéro)
			}
		})

		it('permet la composition avec pipe', () => {
			const montant = euros(100)

			// Chaînage d'opérations: (100€ + 50€) * 2
			const resultat = pipe(montant, plus(euros(50)), fois(2))

			expect(Equal.equals(resultat, euros(300))).toBe(true)
		})
	})

	describe('comparaisons', () => {
		it('comparer correctement deux montants de même unité', () => {
			const montant1 = euros(100)
			const montant2 = euros(50)
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
			const montant1 = euros(100)
			const montant2 = euros(50)

			const supérieur = pipe(montant1, estPlusGrandQue(montant2))
			expect(supérieur).toBe(true)

			const inférieur = pipe(montant2, estPlusPetitQue(montant1))
			expect(inférieur).toBe(true)
		})

		it('vérifie correctement si un montant est positif, négatif ou zéro', () => {
			expect(estPositif(euros(100))).toBe(true)
			expect(estNégatif(euros(-100))).toBe(true)
			expect(estZéro(euros(0))).toBe(true)
			expect(estPositif(euros(0))).toBe(false)
			expect(estNégatif(euros(0))).toBe(false)
		})

		it('conserve le type du montant', () => {
			const centEuros = euros(100)
			const resultat = plus(centEuros, euros(50))

			expectTypeOf<typeof resultat>().toMatchTypeOf<Montant<'€'>>()
		})

		it('renvoie une erreur en cas de division par zéro', () => {
			const centEuros = euros(100)
			const resultat = diviséPar(centEuros, 0)

			expect(isLeft(resultat)).toBe(true)
		})
	})
})
