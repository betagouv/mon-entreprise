import { describe, expect, it } from 'vitest'

import {
	euros,
	eurosParAn,
	eurosParHeure,
	eurosParJour,
	eurosParMois,
	eurosParTitreRestaurant,
} from '@/domaine/Montant'
import {
	annéeCivile,
	employés,
	heuresParMois,
	heuresParSemaine,
	jours,
	joursOuvrés,
	mois,
	pourcentage,
	titresRestaurantParMois,
	trimestreCivil,
} from '@/domaine/Quantité'

import { SearchParamsAdapter } from './SearchParamsAdapter'

describe('SearchParamsAdapter', () => {
	describe('encode', () => {
		it('devrait encoder un Montant en euros', () => {
			expect(SearchParamsAdapter.encode(euros(1500))).toBe('1500€')
		})

		it('devrait encoder un Montant en euros par titre-restaurant', () => {
			expect(SearchParamsAdapter.encode(eurosParTitreRestaurant(12))).toBe(
				'12€/titre-restaurant'
			)
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

		it('devrait encoder une Quantité en heures par mois', () => {
			expect(SearchParamsAdapter.encode(heuresParMois(35))).toBe(
				'35heures/mois'
			)
		})

		it('devrait encoder une Quantité en heures par semaine', () => {
			expect(SearchParamsAdapter.encode(heuresParSemaine(17.33))).toBe(
				'17.33heures/semaine'
			)
		})

		it('devrait encoder une Quantité en jours', () => {
			expect(SearchParamsAdapter.encode(jours(42))).toBe('42jours')
		})

		it('devrait encoder une Quantité en jours ouvrés', () => {
			expect(SearchParamsAdapter.encode(joursOuvrés(2.08))).toBe(
				'2.08jours ouvrés'
			)
		})

		it('devrait encoder une Quantité en mois', () => {
			expect(SearchParamsAdapter.encode(mois(3))).toBe('3mois')
		})

		it('devrait encoder une Quantité en trimestres civils', () => {
			expect(SearchParamsAdapter.encode(trimestreCivil(2))).toBe(
				'2trimestre civil'
			)
		})

		it('devrait encoder une Quantité en années civiles', () => {
			expect(SearchParamsAdapter.encode(annéeCivile(2))).toBe('2année civile')
		})

		it('devrait encoder une Quantité en employés', () => {
			expect(SearchParamsAdapter.encode(employés(11))).toBe('11employés')
		})

		it('devrait encoder une Quantité en titres-restaurant par mois', () => {
			expect(SearchParamsAdapter.encode(titresRestaurantParMois(22))).toBe(
				'22titre-restaurant/mois'
			)
		})

		it('devrait encoder un poucentage', () => {
			expect(SearchParamsAdapter.encode(pourcentage(60))).toBe('60%')
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

		it('devrait décoder un montant en euros par titre-restaurant', () => {
			const result = SearchParamsAdapter.decode('12€/titre-restaurant')
			expect(result).toEqual(eurosParTitreRestaurant(12))
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

		it('devrait décoder une Quantité en heures par mois', () => {
			const result = SearchParamsAdapter.decode('35heures/mois')
			expect(result).toEqual(heuresParMois(35))
		})

		it('devrait décoder une Quantité en heures par semaine', () => {
			const result = SearchParamsAdapter.decode('17.33heures/semaine')
			expect(result).toEqual(heuresParSemaine(17.33))
		})

		it('devrait décoder une Quantité en jours', () => {
			const result = SearchParamsAdapter.decode('42jours')
			expect(result).toEqual(jours(42))
		})

		it('devrait décoder une Quantité en jours ouvrés', () => {
			const result = SearchParamsAdapter.decode('2.08jours ouvrés')
			expect(result).toEqual(joursOuvrés(2.08))
		})

		it('devrait décoder une Quantité en mois', () => {
			const result = SearchParamsAdapter.decode('3mois')
			expect(result).toEqual(mois(3))
		})

		it('devrait décoder une Quantité en trimestres civils', () => {
			const result = SearchParamsAdapter.decode('2trimestre civil')
			expect(result).toEqual(trimestreCivil(2))
		})

		it('devrait décoder une Quantité en années civiles', () => {
			const result = SearchParamsAdapter.decode('2année civile')
			expect(result).toEqual(annéeCivile(2))
		})

		it('devrait décoder une Quantité en employés', () => {
			const result = SearchParamsAdapter.decode('11employés')
			expect(result).toEqual(employés(11))
		})

		it('devrait décoder une Quantité en titres-restaurant par mois', () => {
			const result = SearchParamsAdapter.decode('22titre-restaurant/mois')
			expect(result).toEqual(titresRestaurantParMois(22))
		})

		it('devrait décoder un poucentage', () => {
			const result = SearchParamsAdapter.decode('60%')
			expect(result).toEqual(pourcentage(60))
		})

		it('devrait décoder une quantité avec espace', () => {
			const result = SearchParamsAdapter.decode('3 mois')
			expect(result).toEqual(mois(3))
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

		it('devrait décoder une string qui ressemble à une quantité mais ne l’est pas', () => {
			const result = SearchParamsAdapter.decode('3 petits chats')
			expect(result).toBe('3 petits chats')
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
			const original = heuresParSemaine(40)
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
