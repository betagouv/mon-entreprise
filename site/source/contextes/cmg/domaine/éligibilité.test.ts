/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import { describe, expect, it } from 'vitest'

import {
	auMoinsUnEnfantOuvrantDroitAuCMG,
	enfantOuvreDroitAuCMG,
	estÉligible,
	moyenneHeuresDeGardeSupérieureAuPlancher,
	moyenneHeuresParTypologieDeGarde,
} from '@/contextes/cmg/domaine/éligibilité'
import * as M from '@/domaine/Montant'

import { EnfantFactory } from './enfantFactory'
import { MoisHistoriqueFactory } from './moisHistoriqueFactory'

describe('CMG', () => {
	describe('estÉligible', () => {
		it('est éligible si tous les critères d’éligibilité sont remplis', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Oscar'], { nbHeures: 150 })
						.avecGED({ nbHeures: 31 })
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.avecGED({ nbHeures: 35 })
						.build(),
				},
			})

			expect(résultat).to.be.true
		})

		it('n’est pas éligible si pas de CMG perçu sur mars, avril NI mai', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecGED({ CMG: false }).build(),
					avril: new MoisHistoriqueFactory().avecGED({ CMG: false }).build(),
					mai: new MoisHistoriqueFactory().avecGED({ CMG: false }).build(),
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si ressources = plafond (8 500 €/mois)', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(102_000),
				enfantsÀCharge: {
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecGED().build(),
					avril: new MoisHistoriqueFactory().avecGED().build(),
					mai: new MoisHistoriqueFactory().avecGED().build(),
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si moins de 2 mois employeureuse', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().build(),
					avril: new MoisHistoriqueFactory().build(),
					mai: new MoisHistoriqueFactory().avecGED().build(),
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si la moyenne d’heures de garde ne dépasse pas le plancher', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecGED({ nbHeures: 31 }).build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.avecGED({ nbHeures: 35 })
						.build(),
				},
			})

			expect(résultat).to.be.false
		})

		it('n’est pas éligible si tous les enfants ont plus de 6 ans à la réforme ou sont nés en 2022', () => {
			const résultat = estÉligible({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().plusDe6Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecGED().build(),
					avril: new MoisHistoriqueFactory().avecAMA(['Rose']).build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'])
						.build(),
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresDeGardeSupérieureAuPlancher', () => {
		it('est vrai si au moins une typologie de garde a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Oscar'], { nbHeures: 150 })
						.avecGED({ nbHeures: 31 })
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.avecGED({ nbHeures: 35 })
						.build(),
				},
			})

			expect(résultat).to.be.true
		})

		it('est faux si aucune typologie de garde n’a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Oscar'], { nbHeures: 297 })
						.avecAMA(['Aurore'], { nbHeures: 147 })
						.sansGED()
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose'], { nbHeures: 447 })
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 297 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory().avecGED({ nbHeures: 147 }).build(),
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresParTypologieDeGarde', () => {
		it('le cas Aurore, Rose, Oscar', () => {
			const résultat = moyenneHeuresParTypologieDeGarde({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Oscar'], { nbHeures: 150 })
						.avecGED({ nbHeures: 31 })
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'], { nbHeures: 50 })
						.avecGED({ nbHeures: 35 })
						.build(),
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
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe3Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.avecGED({ nbHeures: 31 })
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose', 'Aurore'], { nbHeures: 50 })
						.sansGED()
						.build(),
					mai: new MoisHistoriqueFactory()
						.avecAMA(['Rose', 'Aurore'], { nbHeures: 50 })
						.avecGED({ nbHeures: 35 })
						.build(),
				},
			})

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 50,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})
	})

	describe('auMoinsUnEnfantOuvrantDroitAuCMG', () => {
		it('ouvre droit si GED et 1 enfant à charge ouvrant droit', () => {
			const résultat = auMoinsUnEnfantOuvrantDroitAuCMG({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.build(),
					avril: new MoisHistoriqueFactory().avecGED({ nbHeures: 1 }).build(),
					mai: new MoisHistoriqueFactory().build(),
				},
			})

			expect(résultat).to.be.true
		})

		it('ouvre droit si AMA uniquement et 1 enfant gardé ouvrant droit', () => {
			const résultat = auMoinsUnEnfantOuvrantDroitAuCMG({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecAMA(['Rose']).build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Oscar', 'Rose', 'Aurore'])
						.build(),
					mai: new MoisHistoriqueFactory().build(),
				},
			})

			expect(résultat).to.be.true
		})

		it('n’ouvre pas droit si AMA uniquement et aucun enfant gardé ouvrant droit', () => {
			const résultat = auMoinsUnEnfantOuvrantDroitAuCMG({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory()
						.avecAMA(['Rose'], { nbHeures: 150 })
						.build(),
					avril: new MoisHistoriqueFactory()
						.avecAMA(['Rose', 'Aurore'], { nbHeures: 150 })
						.build(),
					mai: new MoisHistoriqueFactory().build(),
				},
			})

			expect(résultat).to.be.false
		})

		it('n’ouvre pas droit si aucun enfant à charge ouvrant droit', () => {
			const résultat = auMoinsUnEnfantOuvrantDroitAuCMG({
				ressources: M.eurosParAn(30_000),
				enfantsÀCharge: {
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				historique: {
					mars: new MoisHistoriqueFactory().avecGED().build(),
					avril: new MoisHistoriqueFactory().avecGED().build(),
					mai: new MoisHistoriqueFactory().build(),
				},
			})

			expect(résultat).to.be.false
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
