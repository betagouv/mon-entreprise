import { Either, Equal, Option, pipe } from 'effect'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { estActiviteProfessionnelle } from '@/domaine/économie-collaborative/location-de-meublé/activite'
import { calculeCotisations } from '@/domaine/économie-collaborative/location-de-meublé/cotisations'
import {
	RegimeCotisation,
	SituationLocationCourteDureeValide,
} from '@/domaine/économie-collaborative/location-de-meublé/situation'
import {
	abattement,
	EuroParAn,
	eurosParAn,
	fois,
	moins,
	plus,
} from '@/domaine/Montant'

import { SEUIL_PROFESSIONNALISATION } from './constantes'
import {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
	TAUX_COTISATION_RG_ALSACE_MOSELLE,
	TAUX_COTISATION_RG_NORMAL,
} from './régime-général'

describe('Location de meublé de courte durée', () => {
	describe('estActiviteProfessionnelle', () => {
		it('est faux si les recettes sont inférieures au seuil de professionalisation', () => {
			const situation: SituationLocationCourteDureeValide = {
				_tag: 'Situation',
				recettes: Option.some(
					pipe(SEUIL_PROFESSIONNALISATION, moins(eurosParAn(1)))
				) as Option.Some<EuroParAn>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			expect(estActiviteProfessionnelle(situation)).toBe(false)
		})

		it('est vrai si les recettes sont égales au seuil de professionalisation', () => {
			const situation: SituationLocationCourteDureeValide = {
				_tag: 'Situation',
				recettes: Option.some(
					SEUIL_PROFESSIONNALISATION
				) as Option.Some<EuroParAn>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			expect(estActiviteProfessionnelle(situation)).toBe(true)
		})

		it('est vrai si les recettes sont supérieures au seuil de professionalisation', () => {
			const situation: SituationLocationCourteDureeValide = {
				_tag: 'Situation',
				recettes: Option.some(
					pipe(SEUIL_PROFESSIONNALISATION, plus(eurosParAn(1)))
				) as Option.Some<EuroParAn>,
				regimeCotisation: Option.none(),
				estAlsaceMoselle: Option.none(),
				premièreAnnée: Option.none(),
			}

			expect(estActiviteProfessionnelle(situation)).toBe(true)
		})
	})

	describe('calculeCotisations', () => {
		describe('cas généraux', () => {
			it('retourne une erreur si recettes < seuil de professionnalisation', () => {
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(
						pipe(SEUIL_PROFESSIONNALISATION, moins(eurosParAn(1)))
					) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const resultat = calculeCotisations(situation)

				expect(Either.isLeft(resultat)).toBe(true)
			})

			it('retourne une erreur si régime-général et recettes > plafond', () => {
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(
						pipe(PLAFOND_REGIME_GENERAL, plus(eurosParAn(1)))
					) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const resultat = calculeCotisations(situation)
				expect(Either.isLeft(resultat)).toBe(true)
			})
		})

		describe('régime général', () => {
			it('devrait calculer correctement les cotisations avec abattement standard', () => {
				const recettes = eurosParAn(30000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.some(false),
					premièreAnnée: Option.some(false),
				}

				const assietteAttendue = pipe(
					recettes,
					fois(1 - ABATTEMENT_REGIME_GENERAL)
				)
				const cotisationsAttendues = pipe(
					assietteAttendue,
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(situation)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it("devrait appliquer le taux Alsace-Moselle quand l'option est activée", () => {
				const recettes = eurosParAn(30000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.some(true),
					premièreAnnée: Option.some(false),
				}

				const assietteAttendue = pipe(
					recettes,
					fois(1 - ABATTEMENT_REGIME_GENERAL)
				)
				const cotisationsAttendues = pipe(
					assietteAttendue,
					fois(TAUX_COTISATION_RG_ALSACE_MOSELLE)
				)

				const resultat = calculeCotisations(situation)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it('devrait appliquer le calcul spécifique pour la première année', () => {
				const recettes = eurosParAn(30_000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.some(false),
					premièreAnnée: Option.some(true),
				}

				const cotisationsAttendues = pipe(
					recettes,
					moins(SEUIL_PROFESSIONNALISATION),
					fois(1 - ABATTEMENT_REGIME_GENERAL),
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(situation)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, cotisationsAttendues)).toEqual(
						true
					)
				}
			})

			it('devrait avoir une assiette plancher à 0 pour la première année', () => {
				const recettes = pipe(SEUIL_PROFESSIONNALISATION, plus(eurosParAn(100)))

				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.regimeGeneral),
					estAlsaceMoselle: Option.some(false),
					premièreAnnée: Option.some(true),
				}

				const cotisationsAttendues = pipe(
					recettes,
					moins(SEUIL_PROFESSIONNALISATION),
					abattement(ABATTEMENT_REGIME_GENERAL),
					fois(TAUX_COTISATION_RG_NORMAL)
				)

				const resultat = calculeCotisations(situation)
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
				const recettes = eurosParAn(30_000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(RegimeCotisation.microEntreprise),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const resultat = calculeCotisations(situation)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(Equal.equals(resultat.right, eurosParAn(3_720))).toEqual(true)
				}
			})
		})

		describe('travailleur-indépendant', () => {
			it("devrait appeler l'engine Publicodes avec les bons paramètres", () => {
				const recettes = eurosParAn(30_000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.some(
						RegimeCotisation.travailleurIndependant
					),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const resultat = calculeCotisations(situation)

				expect(Either.isRight(resultat)).toBe(true)

				if (Either.isRight(resultat)) {
					expect(resultat.right.valeur).toEqual(8_847)
				}
			})

			it('devrait traiter le cas sans régime spécifié (utilisant travailleur-indépendant par défaut)', () => {
				const recettes = eurosParAn(30_000)
				const situation: SituationLocationCourteDureeValide = {
					_tag: 'Situation',
					recettes: Option.some(recettes) as Option.Some<EuroParAn>,
					regimeCotisation: Option.none(),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const resultat = calculeCotisations(situation)
				expect(Either.isRight(resultat)).toBe(true)
				if (Either.isRight(resultat)) {
					expect(resultat.right.valeur).toEqual(8_847)
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
})
