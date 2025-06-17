/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import * as M from '@/domaine/Montant'

import { EnfantFactory } from './enfantFactory'
import { enfantsGardésOuvrantDroitAuCMG } from './ouverture-droit'
import { SalariéeAMAFactory, SalariéeGEDFactory } from './salariéeFactory'

describe('CMG', () => {
	describe('ouverture-droit', () => {
		describe('enfantsGardésOuvrantDroitAuCMG', () => {
			it('retourne un tableau vide si aucun enfant à charge ouvrant droit', () => {
				const résultat = enfantsGardésOuvrantDroitAuCMG({
					_tag: 'Situation',
					aPerçuCMG: O.some(true) as O.Some<boolean>,
					plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
					parentIsolé: O.some(false) as O.Some<boolean>,
					ressources: O.some(M.eurosParAn(30_000)) as O.Some<
						M.Montant<'EuroParAn'>
					>,
					enfantsÀCharge: {
						enfants: [
							new EnfantFactory('Rose').néEn(2022).build(),
							new EnfantFactory('Aurore').plusDe6Ans().build(),
						],
						perçoitAeeH: O.some(false),
						AeeH: O.none(),
					},
					salariées: {
						GED: [new SalariéeGEDFactory().build()],
						AMA: [
							new SalariéeAMAFactory(['Rose']).build(),
							new SalariéeAMAFactory(['Rose', 'Aurore']).build(),
						],
					},
				})

				expect(résultat).to.be.deep.equal([])
			})

			it('retourne un tableau vide si AMA uniquement et aucun enfant gardé ouvrant droit', () => {
				const résultat = enfantsGardésOuvrantDroitAuCMG({
					_tag: 'Situation',
					aPerçuCMG: O.some(true) as O.Some<boolean>,
					plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
					parentIsolé: O.some(false) as O.Some<boolean>,
					ressources: O.some(M.eurosParAn(30_000)) as O.Some<
						M.Montant<'EuroParAn'>
					>,
					enfantsÀCharge: {
						enfants: [
							new EnfantFactory('Oscar').moinsDe3Ans().build(),
							new EnfantFactory('Rose').néEn(2022).build(),
							new EnfantFactory('Aurore').plusDe6Ans().build(),
						],
						perçoitAeeH: O.some(false),
						AeeH: O.none(),
					},
					salariées: {
						GED: [],
						AMA: [
							new SalariéeAMAFactory(['Rose']).build(),
							new SalariéeAMAFactory(['Rose', 'Aurore']).build(),
						],
					},
				})

				expect(résultat).to.be.deep.equal([])
			})

			it('retourne', () => {
				const Oscar = new EnfantFactory('Oscar').moinsDe3Ans().build()
				const Rose = new EnfantFactory('Rose').plusDe3Ans().build()
				const Aurore = new EnfantFactory('Aurore').plusDe6Ans().build()

				const résultat = enfantsGardésOuvrantDroitAuCMG({
					_tag: 'Situation',
					aPerçuCMG: O.some(true) as O.Some<boolean>,
					plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
					parentIsolé: O.some(false) as O.Some<boolean>,
					ressources: O.some(M.eurosParAn(30_000)) as O.Some<
						M.Montant<'EuroParAn'>
					>,
					enfantsÀCharge: {
						enfants: [Oscar, Rose, Aurore],
						perçoitAeeH: O.some(false),
						AeeH: O.none(),
					},
					salariées: {
						GED: [new SalariéeGEDFactory().build()],
						AMA: [
							new SalariéeAMAFactory(['Rose']).build(),
							new SalariéeAMAFactory(['Rose', 'Aurore']).build(),
						],
					},
				})

				expect(résultat).to.be.deep.equal([
					{
						enfant: Oscar,
						dateDeFin: new Date('2026-09-01'),
					},
					{
						enfant: Rose,
						dateDeFin: new Date('2026-08-01'),
					},
				])
			})
		})
	})
})
