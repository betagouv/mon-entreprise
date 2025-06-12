import { Option as O } from 'effect'
import { DottedName } from 'modele-social'
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
				unité: 'heures/mois',
			},
			'pourcentage majoration': {
				valeur: 25,
				unité: '%',
			},
			'durée contrat': {
				valeur: 6,
				unité: 'mois',
			},
			'nombre employés': {
				valeur: 50,
				unité: 'employés',
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
		it('décode une quantité avec unité heures/mois', () => {
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

		it('décode un montant', () => {
			const node = engine.evaluate('salaire')
			const result = PublicodesAdapter.decode(node)

			expect(O.isSome(result)).toBe(true)
			const value = O.getOrNull(result)
			expect(Montant.isMontant(value)).toBe(true)
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
			const result = PublicodesAdapter.encode(
				O.some(quantité),
				'contrat salarié . temps de travail' as DottedName
			)

			expect(result).toEqual({
				valeur: 35,
				unité: 'heures/mois',
			})
		})

		it('encode un pourcentage', () => {
			const pourcentage = Quantité.pourcentage(15.5)
			const result = PublicodesAdapter.encode(
				O.some(pourcentage),
				'contrat salarié . pourcentage' as DottedName
			)

			expect(result).toEqual({
				valeur: 15.5,
				unité: '%',
			})
		})

		it('encode un montant', () => {
			const montant = Montant.eurosParMois(1500)
			const result = PublicodesAdapter.encode(
				O.some(montant),
				'contrat salarié . rémunération . brut de base' as DottedName
			)

			expect(result).toBe('1500 €/mois')
		})

		it('encode un nombre', () => {
			const result = PublicodesAdapter.encode(
				O.some(42),
				'entreprise . effectif' as DottedName
			)
			expect(result).toBe(42)
		})

		it('encode une chaîne', () => {
			const result = PublicodesAdapter.encode(
				O.some('test'),
				'entreprise . nom' as DottedName
			)
			expect(result).toBe("'test'")
		})

		it('encode None en undefined', () => {
			const result = PublicodesAdapter.encode(
				O.none(),
				'entreprise . effectif' as DottedName
			)
			expect(result).toBeUndefined()
		})
	})
})
