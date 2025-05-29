/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import { describe, expect, it } from 'vitest'

import * as M from '@/domaine/Montant'

import {
	calculeCMGRLinéarisé,
	coûtMensuelDeLaGarde,
	moyenneCMGPerçus,
	tauxEffortHoraire,
} from './calcul'
import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { EnfantFactory } from './enfantFactory'
import { MoisHistoriqueFactory } from './moisHistoriqueFactory'

describe('CMG', () => {
	describe('moyenneCMGPerçus', () => {
		it('fait la moyenne de tous les CMG perçus pour Jules et Martin', () => {
			const résultat = moyenneCMGPerçus({
				mars: new MoisHistoriqueFactory()
					.avecAMA(['Jules'], { CMG: M.euros(250) })
					.avecAMA(['Martin'], { CMG: M.euros(200) })
					.avecGED({ CMG: M.euros(120) })
					.build(),
				avril: new MoisHistoriqueFactory()
					.avecAMA(['Jules'], { CMG: M.euros(140) })
					.avecAMA(['Jules'], { CMG: M.euros(230) })
					.avecGED({ CMG: M.euros(200) })
					.build(),
				mai: new MoisHistoriqueFactory()
					.avecAMA(['Jules'], { CMG: M.euros(200) })
					.avecAMA(['Martin'], { CMG: M.euros(150) })
					.avecAMA(['Jules'], { CMG: M.euros(100) })
					.avecGED({ CMG: M.euros(70) })
					.build(),
			})

			expect(résultat).to.be.deep.equal(M.euros(553.33))
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
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
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
					enfants: {
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
				M.eurosParMois(1000)
			)

			expect(résultat).to.be.deep.equal(M.euros(43.23))
		})
	})

	describe('tauxEffortHoraire', () => {
		it('pour une garde AMA avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: {
					Oscar: new EnfantFactory().moinsDe3Ans().build(),
					Rose: new EnfantFactory().néEn(2022).build(),
					Aurore: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.0413)
		})
		it('pour une garde GED avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: {
					Oscar: new EnfantFactory().moinsDe3Ans().build(),
					Rose: new EnfantFactory().néEn(2022).build(),
					Aurore: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.0826)
		})
		it('pour une garde AMA avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: {
					Raphael: new EnfantFactory().moinsDe3Ans().build(),
					Leonardo: new EnfantFactory().néEn(2022).build(),
					Donatello: new EnfantFactory().plusDe6Ans().build(),
					Michelangelo: new EnfantFactory().plusDe6Ans().build(),
					Splinter: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.031)
		})
		it('pour une garde GED avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: {
					Raphael: new EnfantFactory().moinsDe3Ans().build(),
					Leonardo: new EnfantFactory().néEn(2022).build(),
					Donatello: new EnfantFactory().plusDe6Ans().build(),
					Michelangelo: new EnfantFactory().plusDe6Ans().build(),
					Splinter: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.062)
		})
		it('pour une garde AMA avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: {
					Ron: new EnfantFactory().néEn(2014).build(),
					Fred: new EnfantFactory().néEn(2016).build(),
					George: new EnfantFactory().néEn(2016).build(),
					Riri: new EnfantFactory().néEn(2018).build(),
					Fifi: new EnfantFactory().néEn(2018).build(),
					Loulou: new EnfantFactory().néEn(2018).build(),
					Leonardo: new EnfantFactory().néEn(2020).build(),
					Donatello: new EnfantFactory().néEn(2020).build(),
					Michelangelo: new EnfantFactory().néEn(2022).build(),
					Raphael: new EnfantFactory().néEn(2024).build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: {
					Ron: new EnfantFactory().néEn(2014).build(),
					Fred: new EnfantFactory().néEn(2016).build(),
					George: new EnfantFactory().néEn(2016).build(),
					Riri: new EnfantFactory().néEn(2018).build(),
					Fifi: new EnfantFactory().néEn(2018).build(),
					Loulou: new EnfantFactory().néEn(2018).build(),
					Leonardo: new EnfantFactory().néEn(2020).build(),
					Donatello: new EnfantFactory().néEn(2020).build(),
					Michelangelo: new EnfantFactory().néEn(2022).build(),
					Raphael: new EnfantFactory().néEn(2024).build(),
				},
				AeeH: 0,
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: {
					Oscar: new EnfantFactory().moinsDe3Ans().build(),
					Rose: new EnfantFactory().néEn(2022).build(),
					Aurore: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 2,
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: {
					Oscar: new EnfantFactory().moinsDe3Ans().build(),
					Rose: new EnfantFactory().néEn(2022).build(),
					Aurore: new EnfantFactory().plusDe6Ans().build(),
				},
				AeeH: 2,
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('AMA', {
				enfants: {
					Ron: new EnfantFactory().néEn(2014).build(),
					Fred: new EnfantFactory().néEn(2016).build(),
					George: new EnfantFactory().néEn(2016).build(),
					Riri: new EnfantFactory().néEn(2018).build(),
					Fifi: new EnfantFactory().néEn(2018).build(),
					Loulou: new EnfantFactory().néEn(2018).build(),
					Leonardo: new EnfantFactory().néEn(2020).build(),
					Donatello: new EnfantFactory().néEn(2020).build(),
					Michelangelo: new EnfantFactory().néEn(2022).build(),
					Raphael: new EnfantFactory().néEn(2024).build(),
				},
				AeeH: 2,
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire('GED', {
				enfants: {
					Ron: new EnfantFactory().néEn(2014).build(),
					Fred: new EnfantFactory().néEn(2016).build(),
					George: new EnfantFactory().néEn(2016).build(),
					Riri: new EnfantFactory().néEn(2018).build(),
					Fifi: new EnfantFactory().néEn(2018).build(),
					Loulou: new EnfantFactory().néEn(2018).build(),
					Leonardo: new EnfantFactory().néEn(2020).build(),
					Donatello: new EnfantFactory().néEn(2020).build(),
					Michelangelo: new EnfantFactory().néEn(2022).build(),
					Raphael: new EnfantFactory().néEn(2024).build(),
				},
				AeeH: 2,
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
