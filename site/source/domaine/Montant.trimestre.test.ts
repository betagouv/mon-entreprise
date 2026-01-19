import { Equal } from 'effect'
import { describe, expect, it } from 'vitest'

import {
	eurosParAn,
	eurosParMois,
	eurosParTrimestre,
	toEurosParAn,
	toEurosParMois,
	toEurosParTrimestre,
	estEuroParTrimestre,
	toString,
} from './Montant'

describe('Montant - Support du trimestre (€/trimestre)', () => {
	describe('Constructeurs', () => {
		it('crée correctement un montant en euros par trimestre', () => {
			const montant = eurosParTrimestre(300)
			expect(montant.unité).toBe('€/trimestre')
			expect(toString(montant)).toBe('300 €/trimestre')
		})

		it('détecte correctement un montant en euros par trimestre', () => {
			const montant = eurosParTrimestre(300)
			expect(estEuroParTrimestre(montant)).toBe(true)
		})

		it('n\'accepte pas d\'autres unités dans estEuroParTrimestre', () => {
			expect(estEuroParTrimestre(eurosParMois(100))).toBe(false)
			expect(estEuroParTrimestre(eurosParAn(1200))).toBe(false)
		})
	})

	describe('Conversions du trimestre vers mois', () => {
		it('convertit 300 €/trimestre en 100 €/mois', () => {
			const trimestre = eurosParTrimestre(300)
			const résultat = toEurosParMois(trimestre)

			expect(résultat.unité).toBe('€/mois')
			expect(résultat.valeur).toBe(100)
			expect(toString(résultat)).toBe('100 €/mois')
		})

		it('convertit 1200 €/trimestre en 400 €/mois', () => {
			const trimestre = eurosParTrimestre(1200)
			const résultat = toEurosParMois(trimestre)

			expect(Equal.equals(résultat, eurosParMois(400))).toBe(true)
		})

		it('gère correctement les décimales lors de la conversion', () => {
			const trimestre = eurosParTrimestre(100)
			const résultat = toEurosParMois(trimestre)

			// 100 / 3 ≈ 33.333... arrondi à 33.33
			expect(résultat.valeur).toBeCloseTo(33.33, 2)
		})
	})

	describe('Conversions du trimestre vers année', () => {
		it('convertit 300 €/trimestre en 1200 €/an', () => {
			const trimestre = eurosParTrimestre(300)
			const résultat = toEurosParAn(trimestre)

			expect(résultat.unité).toBe('€/an')
			expect(résultat.valeur).toBe(1200)
			expect(toString(résultat)).toBe('1200 €/an')
		})

		it('convertit 1000 €/trimestre en 4000 €/an', () => {
			const trimestre = eurosParTrimestre(1000)
			const résultat = toEurosParAn(trimestre)

			expect(Equal.equals(résultat, eurosParAn(4000))).toBe(true)
		})
	})

	describe('Conversions vers trimestre', () => {
		it('convertit 100 €/mois en 300 €/trimestre', () => {
			const mois = eurosParMois(100)
			const résultat = toEurosParTrimestre(mois)

			expect(résultat.unité).toBe('€/trimestre')
			expect(résultat.valeur).toBe(300)
			expect(toString(résultat)).toBe('300 €/trimestre')
		})

		it('convertit 1200 €/an en 300 €/trimestre', () => {
			const an = eurosParAn(1200)
			const résultat = toEurosParTrimestre(an)

			expect(résultat.unité).toBe('€/trimestre')
			expect(résultat.valeur).toBe(300)
			expect(toString(résultat)).toBe('300 €/trimestre')
		})

		it('convertit 2400 €/an en 600 €/trimestre', () => {
			const an = eurosParAn(2400)
			const résultat = toEurosParTrimestre(an)

			expect(Equal.equals(résultat, eurosParTrimestre(600))).toBe(true)
		})
	})

	describe('Conversions croisées avec trimestre', () => {
		it('mois -> trimestre -> mois conserve la valeur', () => {
			const moisOriginal = eurosParMois(200)
			const viaTrimestreEtRetour = toEurosParMois(
				toEurosParTrimestre(moisOriginal)
			)

			expect(viaTrimestreEtRetour.valeur).toBeCloseTo(moisOriginal.valeur, 2)
		})

		it('an -> trimestre -> an conserve la valeur', () => {
			const anOriginal = eurosParAn(2400)
			const viaTrimestreEtRetour = toEurosParAn(
				toEurosParTrimestre(anOriginal)
			)

			expect(Equal.equals(viaTrimestreEtRetour, anOriginal)).toBe(true)
		})

		it('trimestre -> mois -> an donne le bon résultat', () => {
			const trimestre = eurosParTrimestre(300) // = 100/mois = 1200/an
			const viaMois = toEurosParAn(toEurosParMois(trimestre))

			expect(viaMois.valeur).toBeCloseTo(1200, 2)
		})
	})

	describe('Cas d\'usage auto-entrepreneur', () => {
		it('CA trimestriel de 5000€ -> cotisations (22.2%) -> 1110€/trimestre', () => {
			// Cas simplifié: 22.2% de taux forfaitaire
			const caTrimestriel = eurosParTrimestre(5000)
			const tauxCotisation = 0.222
			const cotisations = eurosParTrimestre(caTrimestriel.valeur * tauxCotisation)

			expect(cotisations.valeur).toBeCloseTo(1110, 1)
			expect(toString(cotisations)).toBe('1110 €/trimestre')

			// Même résultat en mensuel
			const caMensuel = toEurosParMois(caTrimestriel)
			const cotisationsMensuelles = eurosParMois(caMensuel.valeur * tauxCotisation)
			const cotisationsTrimestriellesViaMensuel = eurosParTrimestre(
				cotisationsMensuelles.valeur * 3
			)

			expect(cotisationsTrimestriellesViaMensuel.valeur).toBeCloseTo(
				cotisations.valeur,
				2
			)
		})

		it('CA trimestriel de 15000€ -> annuel de 60000€', () => {
			const caTrimestriel = eurosParTrimestre(15000)
			const caAnnuel = toEurosParAn(caTrimestriel)

			expect(caAnnuel.valeur).toBe(60000)
		})
	})
})
