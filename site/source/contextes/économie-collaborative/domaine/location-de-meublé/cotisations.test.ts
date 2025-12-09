import { Either, Equal, pipe } from 'effect'
import { describe, expect, expectTypeOf, it } from 'vitest'

import {
	abattement,
	estPlusGrandQue,
	eurosParAn,
	fois,
	moins,
	plus,
} from '@/domaine/Montant'

import { compareRégimes } from './comparateur-régimes'
import { calculeCotisations } from './cotisations'
import {
	estActiviteProfessionnelle,
	SEUIL_PROFESSIONNALISATION,
} from './estActiviteProfessionnelle'
import {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
	TAUX_COTISATION_RG_ALSACE_MOSELLE,
	TAUX_COTISATION_RG_NORMAL,
} from './régime-général'
import { RegimeCotisation } from './situation'
import { situationMeubléDeTourismeBuilder } from './test/situationBuilder'

describe('Location de meublé de courte durée', () => {
	describe('estActiviteProfessionnelle', () => {
		it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(
					pipe(SEUIL_PROFESSIONNALISATION.MEUBLÉ, moins(eurosParAn(1))).valeur
				)
				.build()

			expect(estActiviteProfessionnelle(situation)).toBe(false)
		})

		it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(SEUIL_PROFESSIONNALISATION.MEUBLÉ.valeur)
				.build()

			expect(estActiviteProfessionnelle(situation)).toBe(true)
		})

		it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(
					pipe(SEUIL_PROFESSIONNALISATION.MEUBLÉ, plus(eurosParAn(1))).valeur
				)
				.build()

			expect(estActiviteProfessionnelle(situation)).toBe(true)
		})
	})

	describe('calculeCotisations', () => {
		describe('cas généraux', () => {
			it('retourne une erreur si régime-général et recettes > plafond', () => {
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(
						pipe(PLAFOND_REGIME_GENERAL, plus(eurosParAn(1))).valeur
					)
					.avecTypeDurée('courte')
					.avecAutresRevenus(0)
					.build()

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.regimeGeneral
				)
				expect(Either.isLeft(resultat)).toBe(true)
			})
		})

		describe('régime général', () => {
			it('devrait calculer correctement les cotisations avec abattement standard', () => {
				const recettes = eurosParAn(30000)
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(recettes.valeur)
					.avecAlsaceMoselle(false)
					.avecPremièreAnnée(false)
					.build()

				const assietteAttendue = pipe(
					recettes,
					fois(1 - ABATTEMENT_REGIME_GENERAL)
				)
				const cotisationsAttendues = pipe(
					assietteAttendue,
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.regimeGeneral
				)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it("devrait appliquer le taux Alsace-Moselle quand l'option est activée", () => {
				const recettes = eurosParAn(30000)
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(recettes.valeur)
					.avecAlsaceMoselle(true)
					.avecPremièreAnnée(false)
					.build()

				const assietteAttendue = pipe(
					recettes,
					fois(1 - ABATTEMENT_REGIME_GENERAL)
				)
				const cotisationsAttendues = pipe(
					assietteAttendue,
					fois(TAUX_COTISATION_RG_ALSACE_MOSELLE)
				)

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.regimeGeneral
				)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it('devrait appliquer le calcul spécifique pour la première année', () => {
				const recettes = eurosParAn(30_000)
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(recettes.valeur)
					.avecAlsaceMoselle(false)
					.avecPremièreAnnée(true)
					.build()

				const cotisationsAttendues = pipe(
					recettes,
					moins(SEUIL_PROFESSIONNALISATION.MEUBLÉ),
					fois(1 - ABATTEMENT_REGIME_GENERAL),
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.regimeGeneral
				)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it('devrait avoir une assiette plancher à 0 pour la première année', () => {
				const recettes = pipe(
					SEUIL_PROFESSIONNALISATION.MEUBLÉ,
					plus(eurosParAn(100))
				)

				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(recettes.valeur)
					.avecAlsaceMoselle(false)
					.avecPremièreAnnée(true)
					.build()

				const cotisationsAttendues = pipe(
					recettes,
					moins(SEUIL_PROFESSIONNALISATION.MEUBLÉ),
					abattement(ABATTEMENT_REGIME_GENERAL),
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.regimeGeneral
				)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})
		})

		describe('micro-entreprise', () => {
			it("devrait appeler l'engine Publicodes avec les bons paramètres", () => {
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(30_000)
					.build()

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.microEntreprise
				)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(resultat.right.valeur).toEqual(3_726)
				}
			})
		})

		describe('travailleur-indépendant', () => {
			it("devrait appeler l'engine Publicodes avec les bons paramètres", () => {
				const situation = situationMeubléDeTourismeBuilder()
					.avecRecettes(30_000)
					.build()

				const resultat = calculeCotisations(
					situation,
					RegimeCotisation.travailleurIndependant
				)

				expect(Either.isRight(resultat)).toBe(true)

				if (Either.isRight(resultat)) {
					expect(resultat.right.valeur).toEqual(8_816)
				}
			})
		})
	})

	describe('RegimeCotisation type', () => {
		it('accepte les valeurs valides', () => {
			const microEntreprise: RegimeCotisation = RegimeCotisation.microEntreprise
			const travailleurIndependant: RegimeCotisation =
				RegimeCotisation.travailleurIndependant
			const regimeGeneral: RegimeCotisation = RegimeCotisation.regimeGeneral

			expectTypeOf(microEntreprise).toMatchTypeOf<RegimeCotisation>()
			expectTypeOf(travailleurIndependant).toMatchTypeOf<RegimeCotisation>()
			expectTypeOf(regimeGeneral).toMatchTypeOf<RegimeCotisation>()
		})

		it('rejette les valeurs invalides', () => {
			expectTypeOf<RegimeCotisation>().not.toEqualTypeOf<'autre-regime'>()
		})
	})

	describe('Cohérence des calculs', () => {
		it('calcule des valeurs de cotisations différentes pour chaque régime', () => {
			const situation = situationMeubléDeTourismeBuilder()
				.avecRecettes(40_000)
				.avecAutresRevenus(10_000)
				.avecTypeDurée('courte')
				.avecClassement('non-classé')
				.build()

			const résultats = compareRégimes(situation)

			const régimeGénéral = résultats.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)
			const microEntreprise = résultats.find(
				(r) => r.régime === RegimeCotisation.microEntreprise
			)
			const travailleurIndépendant = résultats.find(
				(r) => r.régime === RegimeCotisation.travailleurIndependant
			)

			if (
				régimeGénéral?.applicable &&
				microEntreprise?.applicable &&
				travailleurIndépendant?.applicable
			) {
				expect(
					Equal.equals(régimeGénéral.cotisations, microEntreprise.cotisations)
				).toBe(false)
				expect(
					Equal.equals(
						régimeGénéral.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
				expect(
					Equal.equals(
						microEntreprise.cotisations,
						travailleurIndépendant.cotisations
					)
				).toBe(false)
			}
		})

		it('devrait prendre en compte le paramètre estAlsaceMoselle', () => {
			const situationBase = situationMeubléDeTourismeBuilder()
				.avecRecettes(40_000)
				.avecAutresRevenus(10_000)
				.avecTypeDurée('courte')
				.avecClassement('non-classé')

			const situationNormale = situationBase.avecAlsaceMoselle(false).build()
			const situationAlsaceMoselle = situationBase
				.avecAlsaceMoselle(true)
				.build()

			const résultatsNormal = compareRégimes(situationNormale)
			const résultatsAlsaceMoselle = compareRégimes(situationAlsaceMoselle)

			const régimeGénéralNormal = résultatsNormal.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)
			const régimeGénéralAlsaceMoselle = résultatsAlsaceMoselle.find(
				(r) => r.régime === RegimeCotisation.regimeGeneral
			)

			if (
				régimeGénéralNormal?.applicable &&
				régimeGénéralAlsaceMoselle?.applicable
			) {
				expect(
					pipe(
						régimeGénéralAlsaceMoselle.cotisations,
						estPlusGrandQue(régimeGénéralNormal.cotisations)
					)
				).toBe(true)
			}
		})
	})
})
