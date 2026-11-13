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

	it('s’ajoutent, après prélèvements sociaux, à la rémunération nette avec dividendes', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation(defaultSituationAvecDividendes)
		const dividendesNets = e2.evaluate({
			valeur: 'assimilé salarié . dividendes . nets',
			unité: '€/mois',
		}).nodeValue as number

		expect(e2).toEvaluate(
			{
				valeur: 'assimilé salarié . rémunération . nette . avec dividendes',
				arrondi: 'oui',
			},
			Math.round(rémunérationNetteSansDividendes + dividendesNets)
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

	it('s’ajoutent, après prélèvements sociaux et PFU, à la rémunération nette après impôt', () => {
		const e1 = engine.setSituation({
			'assimilé salarié . rémunération . brute': '40000 €/an',
		})
		const rémunérationNetteAprèsImpôtSansDividendes = e1.evaluate(
			'assimilé salarié . rémunération . nette . après impôt . avec dividendes'
		).nodeValue as number

		const e2 = engine.setSituation(defaultSituationAvecDividendes)
		const prélèvementsSociauxDividendes = e2.evaluate({
			valeur: 'assimilé salarié . dividendes . prélèvements sociaux',
			unité: '€/mois',
		}).nodeValue as number
		const PFU = e2.evaluate({
			valeur: 'assimilé salarié . dividendes . PFU',
			unité: '€/mois',
		}).nodeValue as number

		expect(e2).toEvaluate(
			{
				valeur:
					'assimilé salarié . rémunération . nette . après impôt . avec dividendes',
				arrondi: 'oui',
			},
			Math.round(
				rémunérationNetteAprèsImpôtSansDividendes +
					dividendes / 12 -
					prélèvementsSociauxDividendes -
					PFU
			)
		)
	})

	it('s’ajoutent au revenu imposable en cas d’imposition au barème progressif', () => {
		const e1 = engine.shallowCopy().setSituation({
			...defaultSituationAvecDividendes,
			'assimilé salarié . dividendes . imposition': "'barème progressif'",
		})
		const rémunérationNetteImposable = e1.evaluate(
			'assimilé salarié . rémunération . nette . imposable'
		).nodeValue as number

		// Revenu brut global = rémunération imposable abattue de 10%
		// + dividendes imposables (dividendes bruts - 40%)
		// - CSG déductible sur les dividendes soumis à prélèvements sociaux
		const revenuBrutGlobal =
			0.9 * rémunérationNetteImposable +
			(dividendes * (100 - 40)) / 100 -
			(6.8 * dividendes) / 100
		const e2 = engine.setSituation({
			'impôt . revenu . brut global': `${revenuBrutGlobal} €/an`,
		})
		const impôtAttendu = e2.evaluate('impôt . montant').nodeValue as number

		expect(e1).toEvaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes',
			impôtAttendu
		)
	})
})
