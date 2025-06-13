import { describe, expect, it } from 'vitest'

import {
	euros,
	eurosParAn,
	eurosParHeure,
	eurosParJour,
	eurosParMois,
} from '@/domaine/Montant'
import { quantité } from '@/domaine/Quantité'

import { SearchParamsAdapter } from './SearchParamsAdapter'

describe('SearchParamsAdapter', () => {
	describe('encode', () => {
		it('devrait encoder un Montant en euros', () => {
			expect(SearchParamsAdapter.encode(euros(1500))).toBe('1500€')
		})

		it('devrait encoder un Montant en euros par mois', () => {
			expect(SearchParamsAdapter.encode(eurosParMois(1539))).toBe('1539€/mois')
		})

		it('devrait encoder un Montant en euros par an', () => {
			expect(SearchParamsAdapter.encode(eurosParAn(20000))).toBe('20000€/an')
		})

		it('devrait encoder un Montant en euros par jour', () => {
			expect(SearchParamsAdapter.encode(eurosParJour(100))).toBe('100€/jour')
		})

		it('devrait encoder un Montant en euros par heure', () => {
			expect(SearchParamsAdapter.encode(eurosParHeure(15.5))).toBe(
				'15.5€/heure'
			)
		})

		it('devrait encoder une Quantité', () => {
			expect(SearchParamsAdapter.encode(quantité(35, 'heures/semaine'))).toBe(
				'35heures/semaine'
			)
		})

		it('devrait encoder un nombre', () => {
			expect(SearchParamsAdapter.encode(42)).toBe('42')
		})

		it('devrait encoder une string simple', () => {
			expect(SearchParamsAdapter.encode('simple')).toBe('simple')
		})

		it('devrait encoder une string avec espaces entre quotes', () => {
			expect(SearchParamsAdapter.encode('avec des espaces')).toBe(
				'avec des espaces'
			)
		})

		it('devrait encoder une string avec caractères spéciaux entre quotes', () => {
			expect(SearchParamsAdapter.encode('valeur/avec/slash')).toBe(
				'valeur/avec/slash'
			)
		})
	})

	describe('decode', () => {
		it('devrait décoder un montant en euros', () => {
			const result = SearchParamsAdapter.decode('1500€')
			expect(result).toEqual(euros(1500))
		})

		it('devrait décoder un montant en euros par mois', () => {
			const result = SearchParamsAdapter.decode('1539€/mois')
			expect(result).toEqual(eurosParMois(1539))
		})

		it('devrait décoder un montant en euros par an', () => {
			const result = SearchParamsAdapter.decode('20000€/an')
			expect(result).toEqual(eurosParAn(20000))
		})

		it('devrait décoder un montant en euros par jour', () => {
			const result = SearchParamsAdapter.decode('100€/jour')
			expect(result).toEqual(eurosParJour(100))
		})

		it('devrait décoder un montant en euros par heure', () => {
			const result = SearchParamsAdapter.decode('15.5€/heure')
			expect(result).toEqual(eurosParHeure(15.5))
		})

		it('devrait décoder un montant avec virgule', () => {
			const result = SearchParamsAdapter.decode('1539,5€/mois')
			expect(result).toEqual(eurosParMois(1539.5))
		})

		it('devrait décoder un montant avec espace', () => {
			const result = SearchParamsAdapter.decode('1539 €/mois')
			expect(result).toEqual(eurosParMois(1539))
		})

		it('devrait décoder une quantité', () => {
			const result = SearchParamsAdapter.decode('35heures/semaine')
			expect(result).toEqual(quantité(35, 'heures/semaine'))
		})

		it('devrait décoder une quantité avec espace', () => {
			const result = SearchParamsAdapter.decode('35 heures/semaine')
			expect(result).toEqual(quantité(35, 'heures/semaine'))
		})

		it('devrait décoder un nombre', () => {
			const result = SearchParamsAdapter.decode('42')
			expect(result).toBe(42)
		})

		it('devrait décoder un nombre décimal', () => {
			const result = SearchParamsAdapter.decode('42.5')
			expect(result).toBe(42.5)
		})

		it('devrait décoder une string quotée', () => {
			const result = SearchParamsAdapter.decode('CDD')
			expect(result).toBe('CDD')
		})

		it('devrait décoder une string quotée avec espaces', () => {
			const result = SearchParamsAdapter.decode('avec des espaces')
			expect(result).toBe('avec des espaces')
		})

		it('devrait décoder une string simple', () => {
			const result = SearchParamsAdapter.decode('simple')
			expect(result).toBe('simple')
		})

		it("devrait décoder une string qui ressemble à un nombre mais ne l'est pas", () => {
			const result = SearchParamsAdapter.decode('42abc')
			expect(result).toBe('42abc')
		})
	})

	describe('aller-retour encode/decode', () => {
		it('devrait préserver les montants', () => {
			const original = eurosParMois(1234.56)
			const encoded = SearchParamsAdapter.encode(original)
			const decoded = SearchParamsAdapter.decode(encoded)
			expect(decoded).toEqual(original)
		})

		it('devrait préserver les quantités', () => {
			const original = quantité(40, 'heures/semaine')
			const encoded = SearchParamsAdapter.encode(original)
			const decoded = SearchParamsAdapter.decode(encoded)
			expect(decoded).toEqual(original)
		})

		it('devrait préserver les nombres', () => {
			const original = 123.45
			const encoded = SearchParamsAdapter.encode(original)
			const decoded = SearchParamsAdapter.decode(encoded)
			expect(decoded).toBe(original)
		})

		it('devrait préserver les strings avec espaces', () => {
			const original = 'une string avec espaces'
			const encoded = SearchParamsAdapter.encode(original)
			const decoded = SearchParamsAdapter.decode(encoded)
			expect(decoded).toBe(original)
		})
	})
})
