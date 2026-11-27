import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const dividendes = 1000

describe('Les dividendes', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('bruts', () => {
		it('sont par défaut intégralement soumis aux prélèvements sociaux', () => {
			const e = engine.setSituation({
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
			})

			expect(e).toEvaluate(
				'paramètres . dividendes . soumis à prélèvements sociaux',
				dividendes
			)
		})

		it('sont soumis par défaut à un PFU de 12,8%', () => {
			const e = engine.setSituation({
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
				'paramètres . dividendes . soumis à prélèvements sociaux': `${dividendes / 2} €/an`,
			})

			expect(e).toEvaluate('dividendes . PFU', (12.8 * dividendes) / 100)
			expect(e).not.toBeApplicable('dividendes . imposables')
		})

		it('peuvent être imposables au barème progressif de l’IR après abattement de 40% et soustraction de la CSG déductible', () => {
			const e = engine.setSituation({
				'paramètres . dividendes . bruts': `${dividendes} €/an`,
				'paramètres . dividendes . soumis à prélèvements sociaux': `${dividendes / 2} €/an`,
				'paramètres . dividendes . imposition au barème progressif': 'oui',
			})
			const CSGDéductible = e.evaluate(
				'dividendes . prélèvements sociaux . CSG déductible'
			).nodeValue as number

			expect(e).not.toBeApplicable('dividendes . PFU')
			expect(e).toEvaluate(
				'impôt . revenu . net imposable',
				Math.round(0.6 * dividendes) - CSGDéductible
			)
		})
	})

	it('sont soumis à 18,6% de prélèvements sociaux', () => {
		const e = engine.setSituation({
			'paramètres . dividendes . bruts': `${2 * dividendes} €/an`,
			'paramètres . dividendes . soumis à prélèvements sociaux': `${dividendes} €/an`,
		})

		expect(e).toEvaluate(
			'dividendes . prélèvements sociaux',
			(18.6 * dividendes) / 100
		)
	})
})
