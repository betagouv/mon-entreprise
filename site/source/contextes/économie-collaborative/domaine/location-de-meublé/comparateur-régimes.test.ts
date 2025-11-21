import { Equal, Option, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estPlusGrandQue, eurosParAn, Montant } from '@/domaine/Montant'

import { compareRégimes } from './comparateur-régimes'
import {
	RegimeCotisation,
	SituationÉconomieCollaborativeValide,
} from './situation'
import { situationMeubléDeTourismeBuilder } from './test/situationBuilder'

describe('compareRégimes', () => {
	describe("Location de meublé (hors chambres d'hôtes)", () => {
		const situationLocationMeublé =
			situationMeubléDeTourismeBuilder().avecTypeTourisme('tourisme-non-classé')

		describe('Sous le seuil de professionnalisation (< 23 000€)', () => {
			const situation = situationLocationMeublé.avecRecettes(10_000).build()

			it('marque tous les régimes comme applicables (affiliation volontaire + PA)', () => {
				const résultats = compareRégimes(situation)

				expect(résultats.length).toBe(4)
				résultats.forEach((régime) => {
					expect(régime.applicable).toBe(true)
				})
			})
		})

		describe('Au-dessus du seuil de professionnalisation (>= 23 000€)', () => {
			const situationAuDessusDuSeuil =
				situationLocationMeublé.avecRecettes(30_000)

			describe('Recettes supérieures aux autres revenus (activité principale)', () => {
				const situationActivitéPrincipale =
					situationAuDessusDuSeuil.avecAutresRevenus(20_000)

				describe('Location longue durée uniquement', () => {
					const situation = situationActivitéPrincipale
						.avecTypeDurée('longue')
						.build()

					it("TI et MÉ sont possibles, RG n'est pas applicable", () => {
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

						expect(régimeGénéral?.applicable).toBe(false)
						expect(microEntreprise?.applicable).toBe(true)
						expect(travailleurIndépendant?.applicable).toBe(true)
					})
				})

				describe('Location courte durée uniquement', () => {
					const situationCourteDurée =
						situationActivitéPrincipale.avecTypeDurée('courte')

					describe('Tourisme non classé uniquement', () => {
						const situation = situationCourteDurée.build()

						it("TI et RG sont possibles, MÉ n'est pas applicable", () => {
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

							expect(régimeGénéral?.applicable).toBe(true)
							expect(microEntreprise?.applicable).toBe(false)
							expect(travailleurIndépendant?.applicable).toBe(true)
						})
					})

					it.todo('Tourisme classé uniquement')
				})

				describe('Location mixte (courte et longue durée)', () => {
					it.todo(
						'devrait marquer les régimes applicables selon le type de location'
					)
				})
			})

			describe('Recettes inférieures aux autres revenus (activité secondaire)', () => {
				describe('Location longue durée uniquement', () => {
					it.todo('devrait marquer les régimes applicables')
				})

				describe('Location courte durée uniquement', () => {
					it.todo('devrait marquer les régimes applicables')
				})

				describe('Location mixte (courte et longue durée)', () => {
					it.todo('devrait marquer les régimes applicables')
				})
			})
		})

		describe('Tests de cohérence des calculs', () => {
			it('calcule des valeurs de cotisations différentes pour chaque régime', () => {
				const situation: SituationÉconomieCollaborativeValide = {
					_tag: 'Situation',
					_type: 'économie-collaborative',
					typeLocation: Option.some('non-classé'),
					recettes: Option.some(eurosParAn(40_000)) as Option.Some<
						Montant<'€/an'>
					>,
					autresRevenus: Option.some(eurosParAn(10_000)),
					typeDurée: Option.some('courte'),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

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
				const situationNormale: SituationÉconomieCollaborativeValide = {
					_tag: 'Situation',
					_type: 'économie-collaborative',
					typeLocation: Option.some('non-classé'),
					recettes: Option.some(eurosParAn(40_000)) as Option.Some<
						Montant<'€/an'>
					>,
					autresRevenus: Option.some(eurosParAn(10_000)),
					typeDurée: Option.some('courte'),
					estAlsaceMoselle: Option.some(false),
					premièreAnnée: Option.none(),
				}

				const situationAlsaceMoselle: SituationÉconomieCollaborativeValide = {
					_tag: 'Situation',
					_type: 'économie-collaborative',
					typeLocation: Option.some('non-classé'),
					recettes: Option.some(eurosParAn(40_000)) as Option.Some<
						Montant<'€/an'>
					>,
					autresRevenus: Option.some(eurosParAn(10_000)),
					typeDurée: Option.some('courte'),
					estAlsaceMoselle: Option.some(true),
					premièreAnnée: Option.none(),
				}

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

			it('devrait marquer RG, AE et PA comme non applicables, TI applicable au-dessus du plafond RG', () => {
				const situation: SituationÉconomieCollaborativeValide = {
					_tag: 'Situation',
					_type: 'économie-collaborative',
					typeLocation: Option.some('non-classé'),
					recettes: Option.some(eurosParAn(80_000)) as Option.Some<
						Montant<'€/an'>
					>,
					autresRevenus: Option.some(eurosParAn(10_000)),
					typeDurée: Option.some('courte'),
					estAlsaceMoselle: Option.none(),
					premièreAnnée: Option.none(),
				}

				const résultats = compareRégimes(situation)

				const pasDAffiliation = résultats.find(
					(r) => r.régime === RegimeCotisation.pasDAffiliation
				)
				const régimeGénéral = résultats.find(
					(r) => r.régime === RegimeCotisation.regimeGeneral
				)
				const microEntreprise = résultats.find(
					(r) => r.régime === RegimeCotisation.microEntreprise
				)
				const travailleurIndépendant = résultats.find(
					(r) => r.régime === RegimeCotisation.travailleurIndependant
				)

				expect(pasDAffiliation?.applicable).toBe(false)
				expect(régimeGénéral?.applicable).toBe(false)
				expect(microEntreprise?.applicable).toBe(false)
				expect(travailleurIndépendant?.applicable).toBe(true)
			})
		})
	})

	describe("Chambres d'hôtes", () => {
		it.todo("devrait implémenter les règles spécifiques aux chambres d'hôtes")
	})
})
