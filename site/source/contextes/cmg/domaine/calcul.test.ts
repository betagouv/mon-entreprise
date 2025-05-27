/* eslint-disable no-unused-expressions */
/* eslint-disable vitest/valid-expect */
import { describe, expect, it } from 'vitest'

import { coûtMensuelDeLaGarde, tauxEffortHoraire } from './calcul'
import {
	DéclarationsDeGardeAMAFactory,
	DéclarationsDeGardeGEDFactory,
} from './déclarationDeGardeFactory'
import { EnfantFactory } from './enfantFactory'

describe('CMG', () => {
	describe('tauxEffortHoraire', () => {
		it('pour une garde AMA avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0413)
		})
		it('pour une garde GED avec 3 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.0826)
		})
		it('pour une garde AMA avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					enfants: {
						Raphael: new EnfantFactory().moinsDe3Ans().build(),
						Leonardo: new EnfantFactory().néEn(2022).build(),
						Donatello: new EnfantFactory().plusDe6Ans().build(),
						Michelangelo: new EnfantFactory().plusDe6Ans().build(),
						Splinter: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.031)
		})
		it('pour une garde GED avec 5 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					enfants: {
						Raphael: new EnfantFactory().moinsDe3Ans().build(),
						Leonardo: new EnfantFactory().néEn(2022).build(),
						Donatello: new EnfantFactory().plusDe6Ans().build(),
						Michelangelo: new EnfantFactory().plusDe6Ans().build(),
						Splinter: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 0,
				},
			})

			expect(résultat).to.be.equal(0.062)
		})
		it('pour une garde AMA avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
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
				},
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
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
				},
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 3 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
					enfants: {
						Oscar: new EnfantFactory().moinsDe3Ans().build(),
						Rose: new EnfantFactory().néEn(2022).build(),
						Aurore: new EnfantFactory().plusDe6Ans().build(),
					},
					AeeH: 2,
				},
			})

			expect(résultat).to.be.equal(0.0412)
		})
		it('pour une garde AMA avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'AMA',
				enfantsÀCharge: {
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
				},
			})

			expect(résultat).to.be.equal(0.0206)
		})
		it('pour une garde GED avec 10 enfants à charge dont 2 concernés par l’AeeH', () => {
			const résultat = tauxEffortHoraire({
				modeDeGarde: 'GED',
				enfantsÀCharge: {
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
				},
			})

			expect(résultat).to.be.equal(0.0412)
		})
	})

	describe('coûtMensuelDeLaGarde', () => {
		it('utilise le coût de la garde renseigné pour une garde AMA inférieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeAMAFactory(['Rose'])
					.avecNbHeures(100)
					.avecRémunération(800)
					.build()
			)

			expect(résultat).to.be.equal(800)
		})

		it('utilise le taux horaire plafond pour une garde AMA supérieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeAMAFactory(['Rose'])
					.avecNbHeures(100)
					.avecRémunération(900)
					.build()
			)

			expect(résultat).to.be.equal(815)
		})

		it('utilise le coût de la garde renseigné pour une garde GED inférieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeGEDFactory()
					.avecNbHeures(100)
					.avecRémunération(1000)
					.build()
			)

			expect(résultat).to.be.equal(1000)
		})

		it('utilise le taux horaire plafond pour une garde GED supérieure au plafond', () => {
			const résultat = coûtMensuelDeLaGarde(
				new DéclarationsDeGardeGEDFactory()
					.avecNbHeures(100)
					.avecRémunération(1100)
					.build()
			)

			expect(résultat).to.be.equal(1030)
		})
	})
})
