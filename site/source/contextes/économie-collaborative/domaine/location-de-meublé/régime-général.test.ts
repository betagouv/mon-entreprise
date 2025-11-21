import { Either } from 'effect'
import { describe, expect, it } from 'vitest'

import { calculeCotisationsRégimeGénéral } from './régime-général'
import {
	situationChambreDHôteBuilder,
	situationMeubléDeTourismeBuilder,
} from './test/situationBuilder'

describe('calculeCotisationsRégimeGénéral avec typeHébergement et classement', () => {
	describe('type location: non-classé', () => {
		it('devrait retourner une erreur pour recettes < 23 000€ (affiliation non obligatoire)', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(10_000)
				.avecClassement('non-classé')
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe('AffiliationNonObligatoire')
			}
		})

		it('devrait calculer les cotisations pour recettes entre 23 000€ et 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(50_000)
				.avecClassement('non-classé')
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('devrait retourner une erreur pour recettes > 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(80_000)
				.avecClassement('non-classé')
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
				)
			}
		})
	})

	describe('type location: tourisme', () => {
		it('devrait calculer les cotisations pour recettes entre 23 000€ et 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(50_000)
				.avecClassement('classé')
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})

		it('devrait retourner une erreur pour recettes > 77 700€', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(100_000)
				.avecClassement('classé')
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe(
					'RecettesSupérieuresAuPlafondAutoriséPourCeRégime'
				)
			}
		})
	})

	describe('type location: chambre-hôte', () => {
		it('devrait toujours retourner une erreur car RG non applicable pour chambre-hôte', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(10_000)
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe('RégimeNonApplicablePourChambreDHôte')
			}
		})

		it('devrait retourner une erreur même pour recettes élevées', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(50_000)
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isLeft(résultat)).toBe(true)
			if (Either.isLeft(résultat)) {
				expect(résultat.left._tag).toBe('RégimeNonApplicablePourChambreDHôte')
			}
		})
	})

	describe('sans classement', () => {
		it('devrait utiliser les règles pour non-classé par défaut', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(50_000)
				.build()

			const résultat = calculeCotisationsRégimeGénéral(situation)

			expect(Either.isRight(résultat)).toBe(true)
		})
	})
})
