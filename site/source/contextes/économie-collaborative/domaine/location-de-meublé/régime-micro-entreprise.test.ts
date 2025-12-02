import { Either } from 'effect'
import { describe, expect, it } from 'vitest'

import { calculeCotisationsMicroEntreprise } from './régime-micro-entreprise'
import {
	situationChambreDHôteBuilder,
	situationMeubléDeTourismeBuilder,
} from './test/situationBuilder'

describe('calculeCotisationsMicroEntreprise', () => {
	describe('logement non-classé', () => {
		it('calcule les cotisations pour recettes < 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(50_000)
				.avecClassement('non-classé')
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(80_000)
				.avecClassement('non-classé')
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe('logement tourisme classé', () => {
		it('calcule les cotisations pour recettes < 188 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(150_000)
				.avecClassement('classé')
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 188 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(200_000)
				.avecClassement('classé')
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe("chambre d'hôte", () => {
		it('calcule les cotisations pour recettes < 188 700€', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(150_000)
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('retourne une erreur pour recettes > 188 700€', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(200_000)
				.build()

			const résultat = calculeCotisationsMicroEntreprise(situation)

			expect(Either.isLeft(résultat)).toBe(true)
		})
	})

	describe('sans type de location spécifié', () => {
		it('utilise le plafond non-classé par défaut (77 700€)', () => {
			const situationSousPlafond = situationMeubléDeTourismeBuilder()
				.avecRecettes(50_000)
				.build()

			const résultatSousPlafond =
				calculeCotisationsMicroEntreprise(situationSousPlafond)

			expect(Either.isRight(résultatSousPlafond)).toBe(true)
		})

		it('retourne une erreur pour recettes > 77 700€ (plafond par défaut)', () => {
			const situationAuDessusPlafond = situationMeubléDeTourismeBuilder()
				.avecRecettes(80_000)
				.build()

			const résultatAuDessusPlafond = calculeCotisationsMicroEntreprise(
				situationAuDessusPlafond
			)

			expect(Either.isLeft(résultatAuDessusPlafond)).toBe(true)
		})
	})
})
