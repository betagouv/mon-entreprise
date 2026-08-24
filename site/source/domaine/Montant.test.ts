import { Either, Equal } from 'effect'
import { isLeft } from 'effect/Either'
import { describe, expect, it } from 'vitest'

import {
	diviséPar,
	DivisionParZéro,
	estNégatif,
	estPositif,
	estZéro,
	euros,
	eurosParAn,
	eurosParMois,
	fois,
	montantToString,
} from './Montant'

describe('Montant', () => {
	describe('constructeurs', () => {
		it('crée correctement un montant en euros', () => {
			const montant = euros(100)
			expect(montantToString(montant)).toBe('100\u00a0€')
			expect(montant.unité).toBe('€')
			expect(Equal.equals(montant, euros(100))).toBe(true)
		})

		it('crée correctement un montant en euros par mois', () => {
			const montant = eurosParMois(100)
			expect(montant.unité).toBe('€/mois')
			expect(montantToString(montant)).toBe('100\u00a0€/mois')
		})

		it('crée correctement un montant en euros annuels', () => {
			const montant = eurosParAn(100)
			expect(montant.unité).toBe('€/an')
			expect(montantToString(montant)).toBe('100\u00a0€/an')
		})

		it('arrondi automatiquement au centime', () => {
			const montant = euros(100.123)
			expect(Equal.equals(montant, euros(100.12))).toBe(true)

			const montant2 = euros(100.125)
			expect(Equal.equals(montant2, euros(100.13))).toBe(true)
		})
	})

	describe('opérations', () => {
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
	})

	describe('prédicats', () => {
		it('vérifie correctement si un montant est positif, négatif ou zéro', () => {
			expect(estPositif(euros(100))).toBe(true)
			expect(estNégatif(euros(-100))).toBe(true)
			expect(estZéro(euros(0))).toBe(true)
			expect(estPositif(euros(0))).toBe(false)
			expect(estNégatif(euros(0))).toBe(false)
		})

		it('renvoie une erreur en cas de division par zéro', () => {
			const centEuros = euros(100)
			const resultat = diviséPar(centEuros, 0)

			expect(isLeft(resultat)).toBe(true)
		})
	})
})
