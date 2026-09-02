import * as O from 'effect/Option'
import { describe, expect, it } from 'vitest'

import {
	eurosParAn,
	eurosParMois,
	plus,
	toEurosParAn,
} from '@/domaine/MontantRecurrent'

import { ModèleAssimiléSalarié } from './ModeleAssimileSalarie'

describe('ModèleAssimiléSalarié', () => {
	it('préserve les unités : bénéfice = net après impôt + impôt + cotisations', () => {
		ModèleAssimiléSalarié.set.chiffreDAffaires(O.some(eurosParAn(120_000)))
		ModèleAssimiléSalarié.set.charges(O.some(eurosParAn(20_000)))

		const { bénéfice, revenuNetAprèsImpôt } = ModèleAssimiléSalarié.get.revenu()
		const { cotisations, impôt } = ModèleAssimiléSalarié.get.dépenses()

		const bénéficeReconstitué = plus(
			toEurosParAn(revenuNetAprèsImpôt),
			plus(toEurosParAn(impôt), toEurosParAn(cotisations))
		)

		expect(toEurosParAn(bénéfice).valeur).toBeGreaterThan(0)
		expect(bénéficeReconstitué.valeur).toBeCloseTo(
			toEurosParAn(bénéfice).valeur,
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

		ModèleAssimiléSalarié.set.chiffreDAffaires(O.some(eurosParAn(120_000)))
		ModèleAssimiléSalarié.set.charges(O.some(eurosParMois(2_000)))
		const saisieMixteInverse = ModèleAssimiléSalarié.get.revenu()

		expect(toEurosParAn(saisieMixteInverse.bénéfice).valeur).toBeCloseTo(
			toEurosParAn(référence.bénéfice).valeur,
			-1
		)
		expect(
			toEurosParAn(saisieMixteInverse.revenuNetAprèsImpôt).valeur
		).toBeCloseTo(toEurosParAn(référence.revenuNetAprèsImpôt).valeur, -1)
	})
})
