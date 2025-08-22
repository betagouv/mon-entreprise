import { Option as O } from 'effect'
import Engine from 'publicodes'
import { beforeAll, describe, expect, it } from 'vitest'

import * as Montant from '@/domaine/Montant'
import * as Quantité from '@/domaine/Quantité'

import { PublicodesAdapter } from './PublicodesAdapter'

describe('PublicodesAdapter', () => {
	let engine: Engine

	beforeAll(() => {
		engine = new Engine({
			'heures supplémentaires': {
				valeur: 10,
				unité: 'heure/mois',
			},
			'pourcentage majoration': {
				valeur: 25,
				unité: '%',
			},
			'durée contrat': {
				valeur: 6,
				unité: 'mois',
			},
			ancienneté: {
				valeur: 3,
				unité: 'année civile',
			},
			'nombre employés': {
				valeur: 50,
				unité: 'employé',
			},
			salaire: {
				valeur: 2000,
				unité: '€/mois',
			},
			'nombre titres': 15,
			texte: "'Hello world'",
		})
	})

	describe('decode', () => {
		it('décode une quantité avec unité heure/mois', () => {
			const node = engine.evaluate('heures supplémentaires')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Quantité.isQuantité(value)).toBe(true)
			if (Quantité.isQuantité(value)) {
				expect(value.valeur).toBe(10)
				expect(value.unité).toBe('heures/mois')
			}
		})

		it('décode un pourcentage', () => {
			const node = engine.evaluate('pourcentage majoration')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Quantité.isQuantité(value)).toBe(true)
			if (Quantité.isQuantité(value)) {
				expect(value.valeur).toBe(25)
				expect(value.unité).toBe('%')
			}
		})

		it('décode une quantité avec unité invariable', () => {
			const node = engine.evaluate('durée contrat')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Quantité.isQuantité(value)).toBe(true)
			if (Quantité.isQuantité(value)) {
				expect(value.valeur).toBe(6)
				expect(value.unité).toBe('mois')
			}
		})

		it('décode une quantité avec unité en plusieurs mots', () => {
			const node = engine.evaluate('ancienneté')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Quantité.isQuantité(value)).toBe(true)
			if (Quantité.isQuantité(value)) {
				expect(value.valeur).toBe(3)
				expect(value.unité).toBe('années civiles')
			}
		})

		it('décode un montant', () => {
			const node = engine.evaluate('salaire')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Montant.isMontant(value)).toBe(true)
			if (Montant.isMontant(value)) {
				expect(value.valeur).toBe(2000)
				expect(value.unité).toBe('€/mois')
			}
		})

		it('décode un nombre sans unité', () => {
			const node = engine.evaluate('nombre titres')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(typeof value).toBe('number')
			expect(value).toBe(15)
		})

		it('décode une chaîne de caractères', () => {
			const node = engine.evaluate('texte')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			expect(O.getOrNull(result)).toBe('Hello world')
		})
	})

	describe('encode', () => {
		it('encode une quantité avec unité', () => {
			const quantité = Quantité.heuresParMois(35)
			const result = PublicodesAdapter.encode(O.some(quantité))

			expect(result).toEqual({
				valeur: 35,
				unité: 'heures/mois',
			})
		})

		it('encode un pourcentage', () => {
			const pourcentage = Quantité.pourcentage(15.5)
			const result = PublicodesAdapter.encode(O.some(pourcentage))

			expect(result).toEqual({
				valeur: 15.5,
				unité: '%',
			})
		})

		it('encode un montant', () => {
			const montant = Montant.eurosParMois(1500)
			const result = PublicodesAdapter.encode(O.some(montant))

			expect(result).toBe('1500 €/mois')
		})

		it('encode un nombre', () => {
			const result = PublicodesAdapter.encode(O.some(42))
			expect(result).toBe(42)
		})

		it('encode une chaîne', () => {
			const result = PublicodesAdapter.encode(O.some('test'))
			expect(result).toBe("'test'")
		})

		it('encode None en undefined', () => {
			const result = PublicodesAdapter.encode(O.none())
			expect(result).toBeUndefined()
		})
	})
})
