import { Equal, pipe } from 'effect'
import { describe, expect, it } from 'vitest'

import { estPlusGrandQue } from '@/domaine/Montant'

import {
	compareRégimes,
	type RésultatRégimeApplicable,
	type RésultatRégimeNonApplicable,
} from './comparateur-régimes'
import { RegimeCotisation } from './situation'
import {
	situationChambreDHôteBuilder,
	situationMeubléDeTourismeBuilder,
} from './test/situationBuilder'

describe('compareRégimes', () => {
	describe("Location de meublé (hors chambres d'hôtes)", () => {
		const situationLocationMeublé =
			situationMeubléDeTourismeBuilder().avecClassement('non-classé')

		describe('Sous le seuil de professionnalisation (< 23 000€)', () => {
			const situation = situationLocationMeublé.avecRecettes(10_000).build()

			it('Pas’affiliation obligatoire)', () => {
				const résultats = compareRégimes(situation)

				expect(résultats).toAvoirRégimesApplicables([])
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

					it("TI et ME sont possibles, RG n'est pas applicable", () => {
						const résultats = compareRégimes(situation)

						expect(résultats).toAvoirRégimesApplicables([
							RegimeCotisation.microEntreprise,
							RegimeCotisation.travailleurIndependant,
						])
					})
				})

				describe('Location courte durée uniquement', () => {
					const situationCourteDurée =
						situationActivitéPrincipale.avecTypeDurée('courte')

					describe('Tourisme non classé uniquement', () => {
						const situationNonClassé =
							situationCourteDurée.avecClassement('non-classé')

						it("TI et RG sont possibles, ME n'est pas applicable", () => {
							const situation = situationNonClassé.build()
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.travailleurIndependant,
							])
						})

						it('Au-dessus du plafond RG (80 000€), seul TI est applicable', () => {
							const situation = situationNonClassé.avecRecettes(80_000).build()
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Tourisme classé uniquement', () => {
						const situation = situationCourteDurée
							.avecClassement('classé')
							.build()

						it('TI, RG et ME sont tous possibles', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.microEntreprise,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Tourisme mixte (classé et non classé)', () => {
						const situation = situationCourteDurée
							.avecClassement('mixte')
							.build()

						it("TI et RG sont possibles, ME n'est pas applicable (comme non classé)", () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})
				})

				describe('Location mixte (courte et longue durée)', () => {
					const situationMixte =
						situationActivitéPrincipale.avecTypeDurée('mixte')

					describe('Tourisme classé uniquement pour la partie courte durée', () => {
						const situation = situationMixte.avecClassement('classé').build()

						it("TI et ME sont possibles, RG n'est pas applicable", () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.microEntreprise,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Tourisme non classé uniquement pour la partie courte durée', () => {
						const situation = situationMixte
							.avecClassement('non-classé')
							.build()

						it('TI uniquement est possible, ni ME ni RG', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Mix de tourisme classé et non classé pour la partie courte durée', () => {
						const situation = situationMixte.avecClassement('mixte').build()

						it('TI uniquement est possible, ni ME ni RG (comme non classé)', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.travailleurIndependant,
							])
						})
					})
				})
			})

			describe('Recettes inférieures aux autres revenus (activité secondaire)', () => {
				const situationActivitéSecondaire =
					situationAuDessusDuSeuil.avecAutresRevenus(40_000)

				describe('Location longue durée uniquement', () => {
					const situation = situationActivitéSecondaire
						.avecTypeDurée('longue')
						.build()

					it('devrait marquer uniquement PA comme applicable', () => {
						const résultats = compareRégimes(situation)

						expect(résultats).toAvoirRégimesApplicables([])
					})
				})

				describe('Location courte durée uniquement', () => {
					const situationCourteDurée =
						situationActivitéSecondaire.avecTypeDurée('courte')

					describe('Tourisme non classé uniquement', () => {
						const situation = situationCourteDurée
							.avecClassement('non-classé')
							.build()

						it('TI et RG sont possibles, ME non applicable', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Tourisme classé uniquement', () => {
						const situation = situationCourteDurée
							.avecClassement('classé')
							.build()

						it('TI, RG et ME sont tous possibles', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.microEntreprise,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Tourisme mixte (classé et non classé)', () => {
						const situation = situationCourteDurée
							.avecClassement('mixte')
							.build()

						it('TI et RG sont possibles, ME non applicable (comme non classé)', () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.travailleurIndependant,
							])
						})
					})
				})

				describe('Location mixte (courte et longue durée)', () => {
					const situationMixte =
						situationActivitéSecondaire.avecTypeDurée('mixte')

					describe('Recettes courte durée >= 23 000€', () => {
						const situationAvecRecettesCD =
							situationMixte.avecRecettesCourteDurée(23_000)

						describe('Tourisme classé uniquement', () => {
							const situation = situationAvecRecettesCD
								.avecClassement('classé')
								.build()

							it('TI, RG et ME sont tous possibles', () => {
								const résultats = compareRégimes(situation)

								expect(résultats).toAvoirRégimesApplicables([
									RegimeCotisation.regimeGeneral,
									RegimeCotisation.microEntreprise,
									RegimeCotisation.travailleurIndependant,
								])
							})
						})

						describe('Tourisme non classé uniquement', () => {
							const situation = situationAvecRecettesCD
								.avecClassement('non-classé')
								.build()

							it('TI et RG sont possibles, ME non applicable', () => {
								const résultats = compareRégimes(situation)

								expect(résultats).toAvoirRégimesApplicables([
									RegimeCotisation.regimeGeneral,
									RegimeCotisation.travailleurIndependant,
								])
							})
						})

						describe('Tourisme mixte (classé et non classé)', () => {
							const situation = situationAvecRecettesCD
								.avecClassement('mixte')
								.build()

							it('TI et RG sont possibles, ME non applicable (comme non classé)', () => {
								const résultats = compareRégimes(situation)

								expect(résultats).toAvoirRégimesApplicables([
									RegimeCotisation.regimeGeneral,
									RegimeCotisation.travailleurIndependant,
								])
							})
						})
					})

					describe('Recettes courte durée < 23 000€', () => {
						const situation = situationMixte
							.avecRecettesCourteDurée(15_000)
							.build()

						it("Pas d'affiliation uniquement", () => {
							const résultats = compareRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([])
						})
					})
				})
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

	describe("Chambres d'hôtes", () => {
		describe('Au-dessus du seuil de professionnalisation (>= 6 028€)', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(10_000)
				.build()

			it('TI et ME sont possibles, RG non applicable', () => {
				const résultats = compareRégimes(situation)

				expect(résultats).toAvoirRégimesApplicables([
					RegimeCotisation.microEntreprise,
					RegimeCotisation.travailleurIndependant,
				])
			})
		})

		describe('Sous le seuil de professionnalisation (< 6 028€)', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(5_000)
				.build()

			it("Pas d'affiliation obligatoire", () => {
				const résultats = compareRégimes(situation)

				expect(résultats).toAvoirRégimesApplicables([])
			})
		})
	})
})

expect.extend({
	toAvoirRégimesApplicables(
		résultats: Array<RésultatRégimeApplicable | RésultatRégimeNonApplicable>,
		régimesAttendus: RegimeCotisation[]
	) {
		const régimesApplicables = résultats
			.filter((r) => r.applicable)
			.map((r) => r.régime)

		const régimesManquants = régimesAttendus.filter(
			(r) => !régimesApplicables.includes(r)
		)
		const régimesEnTrop = régimesApplicables.filter(
			(r) => !régimesAttendus.includes(r)
		)

		const pass = régimesManquants.length === 0 && régimesEnTrop.length === 0

		return {
			pass,
			message: () => {
				if (pass) {
					return `Les régimes applicables correspondent : ${régimesApplicables.join(
						', '
					)}`
				}

				const errors: string[] = []
				if (régimesManquants.length > 0) {
					errors.push(
						`❌ Régimes qui devraient être applicables, mais reçus comme non applicables : ${régimesManquants.join(
							', '
						)}`
					)
				}
				if (régimesEnTrop.length > 0) {
					errors.push(
						`❌ Régimes qui ne devraient pas être applicables : ${régimesEnTrop.join(
							', '
						)}`
					)
				}

				return errors.join('\n')
			},
		}
	},
})

interface CustomMatchers<R = unknown> {
	toAvoirRégimesApplicables(régimesAttendus: RegimeCotisation[]): R
}

declare module 'vitest' {
	interface Assertion extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
