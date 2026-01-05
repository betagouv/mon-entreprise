import { Either } from 'effect'
import { describe, expect, it } from 'vitest'

import { NON_APPLICABLE } from './applicabilité'
import {
	compareApplicabilitéDesRégimes,
	type RésultatApplicabilitéParRégime,
} from './comparateur-régimes'
import { estApplicableRégimeGénéral } from './régime-général'
import { estApplicableMicroEntreprise } from './régime-micro-entreprise'
import { estApplicableTravailleurIndépendant } from './régime-travailleur-indépendant'
import { RegimeCotisation } from './situation'
import {
	situationChambreDHôteBuilder,
	situationMeubléDeTourismeBuilder,
} from './test/situationBuilder'

describe('compareApplicabilitéDesRégimes', () => {
	describe("Location de meublé (hors chambres d'hôtes)", () => {
		const situationLocationMeublé = situationMeubléDeTourismeBuilder()

		describe('Sous le seuil de professionnalisation (< 23 000€)', () => {
			const situation = situationLocationMeublé.avecRecettes(10_000).build()

			it("Pas d'affiliation obligatoire", () => {
				const résultats = compareApplicabilitéDesRégimes(situation)

				expect(résultats).toNAvoirAucunRégimeApplicable()
			})
		})

		describe('Au-dessus du seuil de professionnalisation (>= 23 000€)', () => {
			const situationAuDessusDuSeuil =
				situationLocationMeublé.avecRecettes(30_000)

			it('Les régimes dépendent des autres revenus pour déterminer activité principale/secondaire', () => {
				const situation = situationAuDessusDuSeuil
					.avecTypeDurée('courte')
					.avecClassement('classé')
					.build()

				expect(estApplicableTravailleurIndépendant(situation)).toEqual(
					Either.left(['autresRevenus'])
				)
				expect(estApplicableRégimeGénéral(situation)).toEqual(
					Either.left(['autresRevenus'])
				)
				expect(estApplicableMicroEntreprise(situation)).toEqual(
					Either.left(['autresRevenus'])
				)
			})
			describe('Recettes supérieures aux autres revenus (activité principale)', () => {
				const situationActivitéPrincipale =
					situationAuDessusDuSeuil.avecAutresRevenus(20_000)

				it('TI est toujours applicable', () => {
					const situation = situationActivitéPrincipale.build()

					const résultat = estApplicableTravailleurIndépendant(situation)

					expect(Either.isRight(résultat)).toBe(true)
					if (Either.isRight(résultat)) {
						expect(résultat.right.applicable).toBe(true)
					}
				})

				it('RG dépend de la question sur le type de durée', () => {
					const situation = situationActivitéPrincipale.build()

					const résultat = estApplicableRégimeGénéral(situation)

					expect(Either.isLeft(résultat)).toBe(true)
					if (Either.isLeft(résultat)) {
						expect(résultat.left).toContain('typeDurée')
					}
				})

				it('ME dépend du type de durée', () => {
					const situation = situationActivitéPrincipale.build()

					const résultat = estApplicableMicroEntreprise(situation)

					expect(résultat).toEqual(Either.left(['typeDurée']))
				})

				describe('Location longue durée uniquement', () => {
					const situation = situationActivitéPrincipale
						.avecTypeDurée('longue')
						.build()

					it("TI et ME sont possibles, RG n'est pas applicable", () => {
						const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.regimeGeneral,
								RegimeCotisation.travailleurIndependant,
							])
						})

						it('Au-dessus du plafond RG (80 000€), seul TI est applicable', () => {
							const situation = situationNonClassé.avecRecettes(80_000).build()
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

							expect(résultats).toAvoirRégimesApplicables([
								RegimeCotisation.travailleurIndependant,
							])
						})
					})

					describe('Mix de tourisme classé et non classé pour la partie courte durée', () => {
						const situation = situationMixte.avecClassement('mixte').build()

						it('TI uniquement est possible, ni ME ni RG (comme non classé)', () => {
							const résultats = compareApplicabilitéDesRégimes(situation)

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

				it('TI dépend du type de durée', () => {
					const situation = situationActivitéSecondaire.build()

					const résultat = estApplicableTravailleurIndépendant(situation)

					expect(résultat).toEqual(Either.left(['typeDurée']))
				})

				it('RG dépend du type de durée', () => {
					const situation = situationActivitéSecondaire.build()

					const résultat = estApplicableRégimeGénéral(situation)

					expect(résultat).toEqual(Either.left(['typeDurée']))
				})

				it('ME dépend du type de durée', () => {
					const situation = situationActivitéSecondaire.build()

					const résultat = estApplicableMicroEntreprise(situation)

					expect(résultat).toEqual(Either.left(['typeDurée']))
				})
				describe('Location longue durée uniquement', () => {
					const situation = situationActivitéSecondaire
						.avecTypeDurée('longue')
						.build()

					it('devrait marquer uniquement PA comme applicable', () => {
						const résultats = compareApplicabilitéDesRégimes(situation)

						expect(résultats).toNAvoirAucunRégimeApplicable()
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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
							const résultats = compareApplicabilitéDesRégimes(situation)

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
								const résultats = compareApplicabilitéDesRégimes(situation)

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
								const résultats = compareApplicabilitéDesRégimes(situation)

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
								const résultats = compareApplicabilitéDesRégimes(situation)

								expect(résultats).toAvoirRégimesApplicables([
									RegimeCotisation.regimeGeneral,
									RegimeCotisation.travailleurIndependant,
								])
							})
						})
					})

					describe('Recettes courte durée < 23 000€', () => {
						const situationSansClassement = situationMixte
							.avecRecettesCourteDurée(15_000)
							.build()

						it("Pas d'affiliation uniquement", () => {
							const résultats = compareApplicabilitéDesRégimes(
								situationSansClassement
							)

							expect(résultats).toNAvoirAucunRégimeApplicable()
						})

						it('ME non applicable avec classement classé', () => {
							const situation = situationMixte
								.avecRecettesCourteDurée(15_000)
								.avecClassement('classé')
								.build()

							expect(estApplicableMicroEntreprise(situation)).toEqual(
								NON_APPLICABLE
							)
						})

						it('ME non applicable avec classement non-classé', () => {
							const situation = situationMixte
								.avecRecettesCourteDurée(15_000)
								.avecClassement('non-classé')
								.build()

							expect(estApplicableMicroEntreprise(situation)).toEqual(
								NON_APPLICABLE
							)
						})

						it('ME non applicable avec classement mixte', () => {
							const situation = situationMixte
								.avecRecettesCourteDurée(15_000)
								.avecClassement('mixte')
								.build()

							expect(estApplicableMicroEntreprise(situation)).toEqual(
								NON_APPLICABLE
							)
						})
					})
				})
			})
		})
	})

	describe("Chambres d'hôtes", () => {
		describe('Au-dessus du seuil de professionnalisation (>= 6 028€)', () => {
			const situation = situationChambreDHôteBuilder()
				.avecRevenuNet(10_000)
				.build()

			it('TI et ME sont possibles, RG non applicable', () => {
				const résultats = compareApplicabilitéDesRégimes(situation)

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
				const résultats = compareApplicabilitéDesRégimes(situation)

				expect(résultats).toNAvoirAucunRégimeApplicable()
			})
		})
	})
})

expect.extend({
	toAvoirRégimesApplicables(
		résultats: RésultatApplicabilitéParRégime[],
		régimesAttendus: RegimeCotisation[]
	) {
		const régimesApplicables = résultats
			.filter((r) => Either.isRight(r.résultat) && r.résultat.right.applicable)
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

	toNAvoirAucunRégimeApplicable(résultats: RésultatApplicabilitéParRégime[]) {
		const régimesSousConditions = résultats.filter((r) =>
			Either.isLeft(r.résultat)
		)
		const régimesApplicables = résultats.filter(
			(r) => Either.isRight(r.résultat) && r.résultat.right.applicable
		)

		const pass =
			régimesSousConditions.length === 0 && régimesApplicables.length === 0

		return {
			pass,
			message: () => {
				if (pass) {
					return 'Aucun régime applicable, comme attendu'
				}

				const errors: string[] = []
				if (régimesApplicables.length > 0) {
					errors.push(
						`❌ Régimes applicables alors qu'ils ne devraient pas l'être : ${régimesApplicables
							.map((r) => r.régime)
							.join(', ')}`
					)
				}
				if (régimesSousConditions.length > 0) {
					errors.push(
						`❌ Régimes sous conditions alors qu'ils devraient être non applicables : ${régimesSousConditions
							.map(
								(r) =>
									`${r.régime} (manque: ${
										Either.isLeft(r.résultat) ? r.résultat.left.join(', ') : ''
									})`
							)
							.join('; ')}`
					)
				}

				return errors.join('\n')
			},
		}
	},
})

interface CustomMatchers<R = unknown> {
	toAvoirRégimesApplicables(régimesAttendus: RegimeCotisation[]): R
	toNAvoirAucunRégimeApplicable(): R
}

declare module 'vitest' {
	interface Assertion extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
