/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import {
	estÉligible,
	moyenneHeuresParTypologieDeGarde,
} from '@/contextes/cmg/domaine/éligibilité'
import { euros } from '@/domaine/Montant'

describe('CMG', () => {
	describe('estÉligible', () => {
		it('est éligible si tous les critères d’éligibilité sont remplis', () => {
			const résultat = estÉligible({
				historique: {
					mars: {
						ressources: O.some(euros(8_500)),
						droitsOuverts: false,
						employeureuse: true,
						modeDeGardes: [],
					},
					avril: {
						ressources: O.none(),
						droitsOuverts: false,
						employeureuse: false,
						modeDeGardes: [],
					},
					mai: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
				},
			})

			expect(résultat).to.be.true
		})
		it('n’est pas éligible si pas de droits ouverts sur mars, avril NI mai', () => {
			const résultat = estÉligible({
				historique: {
					mars: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: false,
						employeureuse: true,
						modeDeGardes: [],
					},
					avril: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: false,
						employeureuse: true,
						modeDeGardes: [],
					},
					mai: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: false,
						employeureuse: true,
						modeDeGardes: [],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si ressources de mai = plafond (8 500 €)', () => {
			const résultat = estÉligible({
				historique: {
					mars: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
					avril: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
					mai: {
						ressources: O.some(euros(8_500)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si moins de 2 mois employeureuse', () => {
			const résultat = estÉligible({
				historique: {
					mars: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: false,
						modeDeGardes: [],
					},
					avril: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: false,
						modeDeGardes: [],
					},
					mai: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible s’il manque les ressources sur un mois employeureuse', () => {
			const résultat = estÉligible({
				historique: {
					mars: {
						ressources: O.none(),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
					avril: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: false,
						modeDeGardes: [],
					},
					mai: {
						ressources: O.some(euros(1_000)),
						droitsOuverts: true,
						employeureuse: true,
						modeDeGardes: [],
					},
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresParTypologieDeGarde', () => {
		it('le cas Aurore, Rose, Oscar', () => {
			const résultat = moyenneHeuresParTypologieDeGarde({
				mars: {
					ressources: O.some(euros(8_500)),
					droitsOuverts: false,
					employeureuse: true,
					modeDeGardes: [
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
				},
				avril: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					modeDeGardes: [
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
				},
				mai: {
					ressources: O.some(euros(1_000)),
					droitsOuverts: true,
					employeureuse: true,
					modeDeGardes: [
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
					ressources: O.some(euros(8_500)),
					droitsOuverts: false,
					employeureuse: true,
					modeDeGardes: [
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
				},
				avril: {
					ressources: O.none(),
					droitsOuverts: false,
					employeureuse: false,
					modeDeGardes: [
						{
							type: 'AMA',
							heuresDeGarde: 50,
							typologieDeGarde: 'AMA Fratrie 0-6 ans',
						},
					],
				},
				mai: {
					ressources: O.some(euros(1_000)),
					droitsOuverts: true,
					employeureuse: true,
					modeDeGardes: [
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
				},
			})

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 50,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})
	})
})
