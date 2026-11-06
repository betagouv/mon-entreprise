import rules from 'modele-as'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Dividendes', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const dividendes = 1000
	const defaultSituationAvecDividendes = {
		'assimilé salarié . rémunération . brute': '40000 €/an',
		'assimilé salarié . dividendes': `${dividendes} €/an`,
	}

	it('sont soumis à 18,6% de prélèvements sociaux', () => {
		const e = engine.setSituation(defaultSituationAvecDividendes)
		const prélévementsSociaux = e.evaluate(
			'assimilé salarié . dividendes . prélèvements sociaux'
		).nodeValue as number

		expect(e).toEvaluate('assimilé salarié . dividendes', dividendes)
		expect(prélévementsSociaux).toEqual((18.6 * dividendes) / 100)
		expect(e).toEvaluate(
			'assimilé salarié . dividendes . nets',
			dividendes - prélévementsSociaux
		)
	})

	it('s’ajoutent à la rémunération nette avec dividendes après prélèvements sociaux', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation(defaultSituationAvecDividendes)
		const dividendesNets = e2.evaluate('assimilé salarié . dividendes . nets')
			.nodeValue as number

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . nette . avec dividendes',
			rémunérationNetteSansDividendes + dividendesNets
		)
	})

	it('sont soumis par défaut à un PFU de 12,8%', () => {
		const e = engine.setSituation(defaultSituationAvecDividendes)

		expect(e).toEvaluate('assimilé salarié . dividendes . PFU', 128)
		expect(e).not.toBeApplicable('assimilé salarié . dividendes . imposables')
	})

	it('ne modifient pas la rémunération imposable en cas de PFU', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteImposableSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . imposable . avec dividendes'
		).nodeValue

		const e2 = engine.setSituation(defaultSituationAvecDividendes)

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . nette . imposable . avec dividendes',
			rémunérationNetteImposableSansDividendes
		)
	})

	it('ne modifient pas le montant de l’impôt en cas de PFU', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const impôtSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes au barème progressif'
		).nodeValue

		const e2 = engine.setSituation(defaultSituationAvecDividendes)

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes au barème progressif',
			impôtSansDividendes
		)
	})

	it('ajoutent le montant du PFU à l’impôt sur le revenu', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const impôtSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation(defaultSituationAvecDividendes)
		const PFU = e2.evaluate('assimilé salarié . dividendes . PFU')
			.nodeValue as number

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes',
			impôtSansDividendes + PFU
		)
	})

	it('s’ajoutent à la rémunération nette après impôt après prélèvements sociaux et PFU', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteAprèsImpôtSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . après impôt . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation(defaultSituationAvecDividendes)
		const prélèvementsSociauxDividendes = e2.evaluate(
			'assimilé salarié . dividendes . prélèvements sociaux'
		).nodeValue as number
		const PFU = e2.evaluate('assimilé salarié . dividendes . PFU')
			.nodeValue as number

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . nette . après impôt . avec dividendes',
			rémunérationNetteAprèsImpôtSansDividendes +
				dividendes -
				prélèvementsSociauxDividendes -
				PFU
		)
	})

	it('peuvent être imposables au barème progressif de l’IR après abattement de 40% et soustraction de la CSG déductible', () => {
		const e = engine.setSituation({
			...defaultSituationAvecDividendes,
			'assimilé salarié . dividendes . imposition': "'barème progressif'",
		})
		const CSGDéductible = e.evaluate(
			'assimilé salarié . dividendes . prélèvements sociaux . CSG déductible'
		).nodeValue as number

		expect(e).not.toBeApplicable('assimilé salarié . dividendes . PFU')
		expect(e).toEvaluate(
			'assimilé salarié . dividendes . imposables',
			Math.round(0.6 * dividendes) - CSGDéductible
		)
	})

	it('s’ajoutent à la rémunération nette imposable en cas d’imposition au barème progressif', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteImposableSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . imposable . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation({
			...defaultSituationAvecDividendes,
			'assimilé salarié . dividendes . imposition': "'barème progressif'",
		})
		const dividendesImposables = e2.evaluate(
			'assimilé salarié . dividendes . imposables'
		).nodeValue as number

		expect(e2).toEvaluate(
			'assimilé salarié . rémunération . nette . imposable . avec dividendes',
			rémunérationNetteImposableSansDividendes + dividendesImposables
		)
	})
})
