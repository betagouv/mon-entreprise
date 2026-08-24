import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import { toEurosParAn } from '@/domaine/Montant'
import { eurosParAn, eurosParMois, plus } from '@/domaine/MontantRécurrent'

import { ModèleAssimiléSalarié } from './ModeleAssimileSalarie'

describe('ModèleAssimiléSalarié', () => {
	it('préserve les unités du moteur : net après impôt + impôt = net à payer avant impôt', () => {
		ModèleAssimiléSalarié.set.chiffreDAffaires(O.some(eurosParAn(120_000)))
		ModèleAssimiléSalarié.set.charges(O.some(eurosParAn(20_000)))

		const { revenuNetAprèsImpôt } = ModèleAssimiléSalarié.get.revenu()
		const { impôt } = ModèleAssimiléSalarié.get.dépenses()

		const avantImpôtReconstitué = plus(
			toEurosParAn(revenuNetAprèsImpôt),
			toEurosParAn(impôt)
		)

		const avantImpôtSelonLeMoteur = ModèleAssimiléSalarié.get
			.engine()
			.evaluate({
				valeur: 'assimilé salarié . rémunération . nette . à payer avant impôt',
				unité: '€/an',
			}).nodeValue as number

		expect(avantImpôtSelonLeMoteur).toBeGreaterThan(0)
		expect(avantImpôtReconstitué.valeur).toBeCloseTo(
			avantImpôtSelonLeMoteur,
			-1
		)
	})

	it('donne les mêmes résultats pour une même situation, quelle que soit l’unité de saisie des objectifs', () => {
		ModèleAssimiléSalarié.set.chiffreDAffaires(O.some(eurosParAn(120_000)))
		ModèleAssimiléSalarié.set.charges(O.some(eurosParAn(24_000)))
		const référence = ModèleAssimiléSalarié.get.revenu()

		ModèleAssimiléSalarié.set.chiffreDAffaires(O.some(eurosParMois(10_000)))
		ModèleAssimiléSalarié.set.charges(O.some(eurosParAn(24_000)))
		const saisieMixte = ModèleAssimiléSalarié.get.revenu()

		expect(toEurosParAn(saisieMixte.bénéfice).valeur).toBeCloseTo(
			toEurosParAn(référence.bénéfice).valeur,
			-1
		)
		expect(toEurosParAn(saisieMixte.revenuNetAprèsImpôt).valeur).toBeCloseTo(
			toEurosParAn(référence.revenuNetAprèsImpôt).valeur,
			-1
		)
	})
})
