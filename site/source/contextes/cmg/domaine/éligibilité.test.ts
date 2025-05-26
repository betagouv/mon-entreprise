/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import {
	enfantOuvreDroitAuCMG,
	estÉligible,
	moyenneHeuresDeGardeSupérieureAuPlancher,
	moyenneHeuresParTypologieDeGarde,
} from '@/contextes/cmg/domaine/éligibilité'
import { euros } from '@/domaine/Montant'

describe('CMG', () => {
	describe('estÉligible', () => {
		it('est éligible si tous les critères d’éligibilité sont remplis', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2019-09-02'),
					},
					{
						dateDeNaissance: new Date('2022-12-31'),
					},
					{
						dateDeNaissance: new Date('2019-09-01'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: false,
						ressources: O.some(euros(8_500)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: false,
						ressources: O.none(),
						employeureuse: false,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 200,
								salaireNet: 1000,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.true
		})

		it('n’est pas éligible si pas de droits ouverts sur mars, avril NI mai', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2023-07-31'),
					},
					{
						dateDeNaissance: new Date('2021-02-18'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: false,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: false,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 200,
								salaireNet: 1000,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: false,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si ressources de mai = plafond (8 500 €)', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2023-07-31'),
					},
					{
						dateDeNaissance: new Date('2021-02-18'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 200,
								salaireNet: 1000,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(8_500)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si moins de 2 mois employeureuse', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2023-07-31'),
					},
					{
						dateDeNaissance: new Date('2021-02-18'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: false,
						déclarationsDeGarde: [],
						salariées: [],
					},
					avril: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: false,
						déclarationsDeGarde: [],
						salariées: [],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible s’il manque les ressources sur un mois employeureuse', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2023-07-31'),
					},
					{
						dateDeNaissance: new Date('2021-02-18'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: true,
						ressources: O.none(),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: false,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 200,
								salaireNet: 1000,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si la moyenne d’heures de garde ne dépasse pas le plancher', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2023-07-31'),
					},
					{
						dateDeNaissance: new Date('2021-02-18'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: true,
						ressources: O.none(),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: false,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si aucun enfant n’ouvre droit au CMG', () => {
			const résultat = estÉligible({
				enfantsÀCharge: {
					total: 3,
					AeeH: 0,
				},
				enfantsGardés: [
					{
						dateDeNaissance: new Date('2019-09-01'),
					},
					{
						dateDeNaissance: new Date('2022-12-31'),
					},
					{
						dateDeNaissance: new Date('2022-01-01'),
					},
				],
				historique: {
					mars: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 31,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 150,
								salaireNet: 750,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 31,
								salaireNet: 310,
							},
						],
					},
					avril: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: false,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 150,
								typologieDeGarde: 'AMA Enfant unique 0-3 ans',
							},
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 200,
								salaireNet: 1000,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
						],
					},
					mai: {
						droitsOuverts: true,
						ressources: O.some(euros(1_000)),
						employeureuse: true,
						déclarationsDeGarde: [
							{
								type: 'AMA',
								heuresDeGarde: 50,
								typologieDeGarde: 'AMA Fratrie 0-6 ans',
							},
							{
								type: 'GED',
								heuresDeGarde: 35,
							},
						],
						salariées: [
							{
								type: 'AMA',
								nbHeures: 50,
								salaireNet: 250,
								indemnitésEntretien: 25,
								fraisDeRepas: 50,
							},
							{
								type: 'GED',
								nbHeures: 35,
								salaireNet: 350,
							},
						],
					},
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresDeGardeSupérieureAuPlancher', () => {
		it('est vrai si au moins une typologie de garde a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				mars: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 150,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 150,
							salaireNet: 750,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				avril: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 150,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 150,
							salaireNet: 750,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				mai: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					déclarationsDeGarde: [],
					salariées: [],
				},
			})

			expect(résultat).to.be.true
		})

		it('est faux si aucune typologie de garde n’a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				mars: {
					ressources: O.some(euros(8_500)),
					droitsOuverts: false,
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 297,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
						{
							type: 'AMA',
							heuresDeGarde: 147,
							typologieDeGarde: 'AMA Enfant unique 3-6 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 444,
							salaireNet: 220,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				avril: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 447,
							typologieDeGarde: 'AMA Fratrie 0-3 ans',
						},
						{
							type: 'AMA',
							heuresDeGarde: 297,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 744,
							salaireNet: 3720,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				mai: {
					ressources: O.some(euros(1_000)),
					droitsOuverts: true,
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'GED',
							heuresDeGarde: 147,
						},
					],
					salariées: [
						{
							type: 'GED',
							nbHeures: 147,
							salaireNet: 1470,
						},
					],
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresParTypologieDeGarde', () => {
		it('le cas Aurore, Rose, Oscar', () => {
			const résultat = moyenneHeuresParTypologieDeGarde({
				mars: {
					droitsOuverts: false,
					ressources: O.some(euros(8_500)),
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 150,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
						{
							type: 'GED',
							heuresDeGarde: 31,
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 150,
							salaireNet: 750,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
						{
							type: 'GED',
							nbHeures: 31,
							salaireNet: 310,
						},
					],
				},
				avril: {
					droitsOuverts: false,
					ressources: O.none(),
					employeureuse: false,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 150,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
						{
							type: 'AMA',
							heuresDeGarde: 50,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 200,
							salaireNet: 1000,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				mai: {
					droitsOuverts: true,
					ressources: O.some(euros(1_000)),
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 50,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
						{
							type: 'GED',
							heuresDeGarde: 35,
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 50,
							salaireNet: 250,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
						{
							type: 'GED',
							nbHeures: 35,
							salaireNet: 350,
						},
					],
				},
			})

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 100,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})

		it('le cas Aurore, Rose', () => {
			const résultat = moyenneHeuresParTypologieDeGarde({
				mars: {
					droitsOuverts: false,
					ressources: O.some(euros(8_500)),
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 150,
							typologieDeGarde: 'AMA Enfant unique 0-3 ans',
						},
						{
							type: 'GED',
							heuresDeGarde: 31,
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 150,
							salaireNet: 750,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
						{
							type: 'GED',
							nbHeures: 31,
							salaireNet: 310,
						},
					],
				},
				avril: {
					droitsOuverts: false,
					ressources: O.none(),
					employeureuse: false,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 50,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 50,
							salaireNet: 250,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
					],
				},
				mai: {
					droitsOuverts: true,
					ressources: O.some(euros(1_000)),
					employeureuse: true,
					déclarationsDeGarde: [
						{
							type: 'AMA',
							heuresDeGarde: 50,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
						{
							type: 'GED',
							heuresDeGarde: 35,
						},
					],
					salariées: [
						{
							type: 'AMA',
							nbHeures: 50,
							salaireNet: 250,
							indemnitésEntretien: 25,
							fraisDeRepas: 50,
						},
						{
							type: 'GED',
							nbHeures: 35,
							salaireNet: 350,
						},
					],
				},
			})

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 50,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})
	})

	describe('enfantOuvreDroitAuCMG', () => {
		it('n’ouvre pas droit si né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				dateDeNaissance: new Date('2022-12-31'),
			})

			expect(résultat).to.be.false
		})
		it('n’ouvre pas droit si plus de 6 ans au 01/09/2025', () => {
			const résultat = enfantOuvreDroitAuCMG({
				dateDeNaissance: new Date('2019-09-01'),
			})

			expect(résultat).to.be.false
		})

		it('ouvre droit si moins de 6 ans au 01/09/2025 et pas né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				dateDeNaissance: new Date('2019-09-02'),
			})

			expect(résultat).to.be.true
		})
	})
})
