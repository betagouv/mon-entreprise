/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as E from 'effect/Either'
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import * as M from '@/domaine/Montant'

import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import {
	auMoinsUnEnfantGardéOuvrantDroitAuCMG,
	éligibilité,
	enfantOuvreDroitAuCMG,
	moyenneHeuresDeGardeSupérieureAuPlancher,
	moyenneHeuresParTypologieDeGarde,
	plafondDeRessources,
} from './éligibilité'
import { EnfantFactory } from './enfantFactory'
import { SalariéeAMAFactory, SalariéeGEDFactory } from './salariéeFactory'

describe('CMG', () => {
	describe('éligibilité', () => {
		it('est éligible si tous les critères d’éligibilité sont remplis', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(31)
									.avecCMG(M.euros(400))
									.build()
							),
							avril: O.none(),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(35)
									.avecCMG(M.euros(400))
									.build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar'])
									.avecNbHeures(150)
									.avecCMG(M.euros(400))
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.avecCMG(M.euros(400))
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.avecCMG(M.euros(400))
									.build()
							),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.avecCMG(M.euros(400))
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(
				E.right(
					E.right({
						estÉligible: true,
						montantCT: M.euros(70.28),
					})
				)
			)
		})

		it('n’est pas éligible si pas de CMG perçu sur mars, avril NI mai', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(31)
									.sansCMG()
									.build()
							),
							avril: O.none(),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(35)
									.sansCMG()
									.build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar'])
									.avecNbHeures(150)
									.sansCMG()
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.sansCMG()
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.sansCMG()
									.build()
							),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.sansCMG()
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['CMG-perçu']))
		})

		it('n’est pas éligible si ressources > plafond (60 659 €/an pour un couple avec 2 enfants à charge)', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(60_660)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [new SalariéeGEDFactory().build()],
					AMA: [new SalariéeAMAFactory(['Rose']).build()],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['ressources']))
		})

		it('n’est pas éligible si moins de 2 mois employeureuse', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [],
					AMA: [
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(300)
									.build()
							),
							mai: O.none(),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['déclarations']))
		})

		it('n’est pas éligible si la moyenne d’heures de garde ne dépasse pas le plancher', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(31).build()
							),
							avril: O.none(),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(35).build()
							),
						},
					],
					AMA: [
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.build()
							),
							mai: O.none(),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.build()
							),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['heures-de-garde']))
		})

		it('n’est pas éligible si tous les enfants gardés ont plus de 6 ans à la réforme ou sont nés en 2022', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
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
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.avecCMG(M.euros(400))
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose', 'Aurore'])
									.avecNbHeures(50)
									.avecCMG(M.euros(400))
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose', 'Aurore'])
									.avecNbHeures(50)
									.avecCMG(M.euros(400))
									.build()
							),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.avecCMG(M.euros(400))
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['enfants-gardés']))
		})

		it('n’est pas éligible si n’a pas perçu de CMG', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(false) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [],
					perçoitAeeH: O.none(),
					AeeH: O.none(),
				},
				salariées: {
					GED: [],
					AMA: [],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['CMG-perçu']))
		})

		it('n’est pas éligible si a saisi moins de 2 déclarations', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(false) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [],
					perçoitAeeH: O.none(),
					AeeH: O.none(),
				},
				salariées: {
					GED: [],
					AMA: [],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['déclarations']))
		})

		it('n’est pas éligible si aucun enfant à charge ouvrant droit', () => {
			const résultat = éligibilité({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').plusDe6Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe6Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [],
					AMA: [],
				},
			})

			expect(résultat).to.be.deep.equal(E.left(['enfants-à-charge']))
		})
	})

	describe('plafondDeRessources', () => {
		it('est de 53 119 € pour un couple avec 1 enfant à charge', () => {
			const résultat = plafondDeRessources(1, false)

			expect(résultat).to.be.deep.equal(M.eurosParAn(53_119))
		})

		it('est majoré de 7 540 € par enfant', () => {
			const résultat = plafondDeRessources(2, false)

			expect(résultat).to.be.deep.equal(M.eurosParAn(53119 + 7540))
		})

		it('est majoré de 40% pour un parent isolé', () => {
			const résultat = plafondDeRessources(1, true)

			expect(résultat).to.be.deep.equal(M.eurosParAn(53119 * 1.4))
		})

		it('est de 106 034,6 € pour un parent isolée avec 4 enfants à charge', () => {
			const résultat = plafondDeRessources(4, true)

			expect(résultat).to.be.deep.equal(M.eurosParAn(106_034.6))
		})
	})

	describe('moyenneHeuresDeGardeSupérieureAuPlancher', () => {
		it('est vrai si au moins une typologie de garde a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(31).build()
							),
							avril: O.none(),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(35).build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar'])
									.avecNbHeures(150)
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(50)
									.build()
							),
						},
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(150)
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.true
		})

		it('est faux si aucune typologie de garde n’a une moyenne d’heures suffisante', () => {
			const résultat = moyenneHeuresDeGardeSupérieureAuPlancher({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Oscar').moinsDe3Ans().build(),
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.none(),
							avril: O.none(),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(147).build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar'])
									.avecNbHeures(297)
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose'])
									.avecNbHeures(447)
									.build()
							),
							mai: O.none(),
						},
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Aurore'])
									.avecNbHeures(147)
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
									.avecNbHeures(297)
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.false
		})
	})

	describe('moyenneHeuresParTypologieDeGarde', () => {
		it('le cas Aurore, Rose, Oscar', () => {
			const résultat = moyenneHeuresParTypologieDeGarde([
				new EnfantFactory('Oscar').moinsDe3Ans().build(),
				new EnfantFactory('Rose').néEn(2022).build(),
				new EnfantFactory('Aurore').plusDe3Ans().build(),
			])([
				new DéclarationsDeGardeAMAFactory(['Oscar']).avecNbHeures(150).build(),
				new DéclarationsDeGardeGEDFactory().avecNbHeures(31).build(),
				new DéclarationsDeGardeAMAFactory(['Rose']).avecNbHeures(150).build(),
				new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
					.avecNbHeures(50)
					.build(),
				new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
					.avecNbHeures(50)
					.build(),
				new DéclarationsDeGardeGEDFactory().avecNbHeures(35).build(),
			])

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 100,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})

		it('le cas Aurore, Rose', () => {
			const résultat = moyenneHeuresParTypologieDeGarde([
				new EnfantFactory('Oscar').moinsDe3Ans().build(),
				new EnfantFactory('Rose').néEn(2022).build(),
				new EnfantFactory('Aurore').plusDe3Ans().build(),
			])([
				new DéclarationsDeGardeGEDFactory().avecNbHeures(31).build(),
				new DéclarationsDeGardeAMAFactory(['Rose']).avecNbHeures(150).build(),
				new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
					.avecNbHeures(50)
					.build(),
				new DéclarationsDeGardeAMAFactory(['Oscar', 'Rose', 'Aurore'])
					.avecNbHeures(50)
					.build(),
				new DéclarationsDeGardeGEDFactory().avecNbHeures(35).build(),
			])

			expect(résultat).to.deep.equal({
				'AMA Enfant unique 0-3 ans': 50,
				'AMA Fratrie 0-6 ans': 34,
				GED: 22,
			})
		})
	})

	describe('auMoinsUnEnfantGardéOuvrantDroitAuCMG', () => {
		it('ouvre droit si GED et 1 enfant à charge ouvrant droit', () => {
			const résultat = auMoinsUnEnfantGardéOuvrantDroitAuCMG({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
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
					GED: [
						{
							mars: O.some(
								new DéclarationsDeGardeGEDFactory().avecNbHeures(1).build()
							),
							avril: O.none(),
							mai: O.none(),
						},
					],
					AMA: [
						new SalariéeAMAFactory(['Rose']).build(),
						new SalariéeAMAFactory(['Rose', 'Aurore']).build(),
					],
				},
			})

			expect(résultat).to.be.true
		})

		it('ouvre droit si AMA uniquement et 1 enfant gardé ouvrant droit', () => {
			const résultat = auMoinsUnEnfantGardéOuvrantDroitAuCMG({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
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
						new SalariéeAMAFactory(['Oscar', 'Rose', 'Aurore']).build(),
					],
				},
			})

			expect(résultat).to.be.true
		})

		it('n’ouvre pas droit si AMA uniquement et aucun enfant gardé ouvrant droit', () => {
			const résultat = auMoinsUnEnfantGardéOuvrantDroitAuCMG({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
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

			expect(résultat).to.be.false
		})

		it('n’ouvre pas droit si aucun enfant à charge ouvrant droit', () => {
			const résultat = auMoinsUnEnfantGardéOuvrantDroitAuCMG({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
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

			expect(résultat).to.be.false
		})
	})

	describe('enfantOuvreDroitAuCMG', () => {
		it('n’ouvre pas droit si né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.none(),
				dateDeNaissance: O.some(new Date('2022-12-31')),
			})

			expect(résultat).to.be.false
		})
		it('n’ouvre pas droit si plus de 6 ans au 01/09/2025', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.none(),
				dateDeNaissance: O.some(new Date('2019-09-01')),
			})

			expect(résultat).to.be.false
		})

		it('ouvre droit si moins de 6 ans au 01/09/2025 et pas né⋅e en 2022', () => {
			const résultat = enfantOuvreDroitAuCMG({
				prénom: O.none(),
				dateDeNaissance: O.some(new Date('2019-09-02')),
			})

			expect(résultat).to.be.true
		})
	})
})
