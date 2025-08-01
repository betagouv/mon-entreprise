/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import * as M from '@/domaine/Montant'

import {
	calculeCMGRLinéarisé,
	calculeComplémentTransitoire,
	coûtMensuelDeLaGarde,
	moyenneCMGPerçus,
	moyenneCMGRLinéarisés,
	tauxEffortHoraire,
} from './calcul'
import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { EnfantFactory } from './enfantFactory'

describe('CMG', () => {
	describe('calculeComplémentTransitoire', () => {
		it('calcule le complément transitoire pour la garde de Jules', () => {
			const résultat = calculeComplémentTransitoire({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Jules').moinsDe3Ans().build(),
						new EnfantFactory('Martin').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.avecCMG(M.euros(200))
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.avecCMG(M.euros(70))
									.build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Jules'])
									.avecNbHeures(100)
									.avecRémunération(M.euros(300))
									.avecCMG(M.euros(250))
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Jules'])
									.avecNbHeures(200)
									.avecRémunération(M.euros(300))
									.avecCMG(M.euros(140))
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(M.euros(49.15))
		})

		it('calcule un complément transitoire nul pour la garde de Rose', () => {
			const résultat = calculeComplémentTransitoire({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Rose').moinsDe3Ans().build(),
						new EnfantFactory('Aurore').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.avecCMG(M.euros(70))
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.avecCMG(M.euros(70))
									.build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Rose'])
									.avecNbHeures(100)
									.avecRémunération(M.euros(300))
									.avecCMG(M.euros(100))
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Jules'])
									.avecNbHeures(100)
									.avecRémunération(M.euros(300))
									.avecCMG(M.euros(100))
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(M.euros(0))
		})
	})

	describe('moyenneCMGPerçus', () => {
		it('fait la moyenne de tous les CMG perçus pour la garde de Jules et Martin', () => {
			const résultat = moyenneCMGPerçus({
				GED: [
					{
						mars: O.some(
							new DéclarationsDeGardeGEDFactory().avecCMG(M.euros(120)).build()
						),
						avril: O.some(
							new DéclarationsDeGardeGEDFactory().avecCMG(M.euros(200)).build()
						),
						mai: O.some(
							new DéclarationsDeGardeGEDFactory().avecCMG(M.euros(70)).build()
						),
					},
				],
				AMA: [
					{
						mars: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(250))
								.build()
						),
						avril: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(140))
								.build()
						),
						mai: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(200))
								.build()
						),
					},
					{
						mars: O.some(
							new DéclarationsDeGardeAMAFactory(['Martin'])
								.avecCMG(M.euros(200))
								.build()
						),
						avril: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(230))
								.build()
						),
						mai: O.some(
							new DéclarationsDeGardeAMAFactory(['Martin'])
								.avecCMG(M.euros(150))
								.build()
						),
					},
					{
						mars: O.none(),
						avril: O.none(),
						mai: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(100))
								.build()
						),
					},
				],
			})

			expect(résultat).to.be.deep.equal(M.euros(553.33))
		})

		it('fait la moyenne de tous les CMG perçus pour la garde de Jules', () => {
			const résultat = moyenneCMGPerçus({
				GED: [
					{
						mars: O.none(),
						avril: O.some(
							new DéclarationsDeGardeGEDFactory().avecCMG(M.euros(200)).build()
						),
						mai: O.some(
							new DéclarationsDeGardeGEDFactory().avecCMG(M.euros(70)).build()
						),
					},
				],
				AMA: [
					{
						mars: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(250))
								.build()
						),
						avril: O.some(
							new DéclarationsDeGardeAMAFactory(['Jules'])
								.avecCMG(M.euros(140))
								.build()
						),
						mai: O.none(),
					},
				],
			})

			expect(résultat).to.be.deep.equal(M.euros(220))
		})
	})

	describe('moyenneCMGRLinéarisés', () => {
		it('calcule la moyenne des CMG-R linéarisés', () => {
			const résultat = moyenneCMGRLinéarisés({
				_tag: 'Situation',
				aPerçuCMG: O.some(true) as O.Some<boolean>,
				plusDe2MoisDeDéclaration: O.some(true) as O.Some<boolean>,
				parentIsolé: O.some(false) as O.Some<boolean>,
				ressources: O.some(M.eurosParAn(30_000)) as O.Some<M.Montant<'€/an'>>,
				enfantsÀCharge: {
					enfants: [
						new EnfantFactory('Jules').moinsDe3Ans().build(),
						new EnfantFactory('Martin').plusDe3Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				salariées: {
					GED: [
						{
							mars: O.none(),
							avril: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.build()
							),
							mai: O.some(
								new DéclarationsDeGardeGEDFactory()
									.avecNbHeures(12)
									.avecRémunération(M.euros(48))
									.build()
							),
						},
					],
					AMA: [
						{
							mars: O.some(
								new DéclarationsDeGardeAMAFactory(['Jules'])
									.avecNbHeures(100)
									.avecRémunération(M.euros(300))
									.build()
							),
							avril: O.some(
								new DéclarationsDeGardeAMAFactory(['Jules'])
									.avecNbHeures(100)
									.avecRémunération(M.euros(300))
									.build()
							),
							mai: O.none(),
						},
					],
				},
			})

			expect(résultat).to.be.deep.equal(M.euros(170.85))
		})
	})

	describe('calculeCMGRLinéarisé', () => {
		it('calcule le CMG-R linéarisé pour 100h de garde AMA à 300€', () => {
			const résultat = calculeCMGRLinéarisé(
				new DéclarationsDeGardeAMAFactory(['Rose'])
					.avecNbHeures(100)
					.avecRémunération(M.euros(300))
					.build(),
				{
					enfants: [
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe6Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				M.eurosParMois(2500)
			)

			expect(résultat).to.be.deep.equal(M.euros(220.21))
		})

		it('calcule le CMG-R linéarisé pour 12h de garde GED à 48€', () => {
			const résultat = calculeCMGRLinéarisé(
				new DéclarationsDeGardeGEDFactory()
					.avecNbHeures(12)
					.avecRémunération(M.euros(48))
					.build(),
				{
					enfants: [
						new EnfantFactory('Rose').néEn(2022).build(),
						new EnfantFactory('Aurore').plusDe6Ans().build(),
					],
					perçoitAeeH: O.some(false),
					AeeH: O.none(),
				},
				M.eurosParMois(2500)
			)

			expect(résultat).to.be.deep.equal(M.euros(36.07))
		})
	})

	describe('tauxEffortHoraire', () => {
		it('pour une garde AMA avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: [
					new EnfantFactory('Oscar').moinsDe3Ans().build(),
					new EnfantFactory('Rose').néEn(2022).build(),
					new EnfantFactory('Aurore').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.0413)
		})
		it('pour une garde GED avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: [
					new EnfantFactory('Oscar').moinsDe3Ans().build(),
					new EnfantFactory('Rose').néEn(2022).build(),
					new EnfantFactory('Aurore').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.0826)
		})
		it('pour une garde AMA avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: [
					new EnfantFactory('Raphael').moinsDe3Ans().build(),
					new EnfantFactory('Leonardo').néEn(2022).build(),
					new EnfantFactory('Donatello').plusDe6Ans().build(),
					new EnfantFactory('Michelangelo').plusDe6Ans().build(),
					new EnfantFactory('Splinter').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.031)
		})
		it('pour une garde GED avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: [
					new EnfantFactory('Raphael').moinsDe3Ans().build(),
					new EnfantFactory('Leonardo').néEn(2022).build(),
					new EnfantFactory('Donatello').plusDe6Ans().build(),
					new EnfantFactory('Michelangelo').plusDe6Ans().build(),
					new EnfantFactory('Splinter').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.062)
		})
		it('pour une garde AMA avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: [
					new EnfantFactory('Ron').néEn(2014).build(),
					new EnfantFactory('Fred').néEn(2016).build(),
					new EnfantFactory('George').néEn(2016).build(),
					new EnfantFactory('Riri').néEn(2018).build(),
					new EnfantFactory('Fifi').néEn(2018).build(),
					new EnfantFactory('Loulou').néEn(2018).build(),
					new EnfantFactory('Leonardo').néEn(2020).build(),
					new EnfantFactory('Donatello').néEn(2020).build(),
					new EnfantFactory('Michelangelo').néEn(2022).build(),
					new EnfantFactory('Raphael').néEn(2024).build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: [
					new EnfantFactory('Ron').néEn(2014).build(),
					new EnfantFactory('Fred').néEn(2016).build(),
					new EnfantFactory('George').néEn(2016).build(),
					new EnfantFactory('Riri').néEn(2018).build(),
					new EnfantFactory('Fifi').néEn(2018).build(),
					new EnfantFactory('Loulou').néEn(2018).build(),
					new EnfantFactory('Leonardo').néEn(2020).build(),
					new EnfantFactory('Donatello').néEn(2020).build(),
					new EnfantFactory('Michelangelo').néEn(2022).build(),
					new EnfantFactory('Raphael').néEn(2024).build(),
				],
				perçoitAeeH: O.some(false),
				AeeH: O.none(),
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: [
					new EnfantFactory('Oscar').moinsDe3Ans().build(),
					new EnfantFactory('Rose').néEn(2022).build(),
					new EnfantFactory('Aurore').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(true),
				AeeH: O.some(2),
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: [
					new EnfantFactory('Oscar').moinsDe3Ans().build(),
					new EnfantFactory('Rose').néEn(2022).build(),
					new EnfantFactory('Aurore').plusDe6Ans().build(),
				],
				perçoitAeeH: O.some(true),
				AeeH: O.some(2),
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: [
					new EnfantFactory('Ron').néEn(2014).build(),
					new EnfantFactory('Fred').néEn(2016).build(),
					new EnfantFactory('George').néEn(2016).build(),
					new EnfantFactory('Riri').néEn(2018).build(),
					new EnfantFactory('Fifi').néEn(2018).build(),
					new EnfantFactory('Loulou').néEn(2018).build(),
					new EnfantFactory('Leonardo').néEn(2020).build(),
					new EnfantFactory('Donatello').néEn(2020).build(),
					new EnfantFactory('Michelangelo').néEn(2022).build(),
					new EnfantFactory('Raphael').néEn(2024).build(),
				],
				perçoitAeeH: O.some(true),
				AeeH: O.some(2),
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: [
					new EnfantFactory('Ron').néEn(2014).build(),
					new EnfantFactory('Fred').néEn(2016).build(),
					new EnfantFactory('George').néEn(2016).build(),
					new EnfantFactory('Riri').néEn(2018).build(),
					new EnfantFactory('Fifi').néEn(2018).build(),
					new EnfantFactory('Loulou').néEn(2018).build(),
					new EnfantFactory('Leonardo').néEn(2020).build(),
					new EnfantFactory('Donatello').néEn(2020).build(),
					new EnfantFactory('Michelangelo').néEn(2022).build(),
					new EnfantFactory('Raphael').néEn(2024).build(),
				],
				perçoitAeeH: O.some(true),
				AeeH: O.some(2),
			})

			expect(résultat).to.be.equal(0.0412)
		})
	})

	describe('coûtMensuelDeLaGarde', () => {
		it('utilise le coût de la garde renseigné pour une garde AMA inférieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeAMAFactory(['Rose'])
					.avecNbHeures(100)
					.avecRémunération(M.euros(700))
					.build()
			)

			expect(résultat).to.be.deep.equal(M.euros(700))
		})

		it('utilise le taux horaire plafond pour une garde AMA supérieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeAMAFactory(['Rose'])
					.avecNbHeures(100)
					.avecRémunération(M.euros(900))
					.build()
			)

			expect(résultat).to.be.deep.equal(M.euros(800))
		})

		it('utilise le coût de la garde renseigné pour une garde GED inférieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeGEDFactory()
					.avecNbHeures(100)
					.avecRémunération(M.euros(400))
					.build()
			)

			expect(résultat).to.be.deep.equal(M.euros(400))
		})

		it('utilise le taux horaire plafond pour une garde GED supérieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeGEDFactory()
					.avecNbHeures(100)
					.avecRémunération(M.euros(1600))
					.build()
			)

			expect(résultat).to.be.deep.equal(M.euros(1500))
		})
	})
})
