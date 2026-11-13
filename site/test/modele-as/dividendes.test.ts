import rules from 'modele-as'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Dividendes', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules, { warn: false })
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
			'assimilé salarié . rémunération . nette . avec dividendes',
			Math.round(rémunérationNetteSansDividendes + dividendesNets)
		)
	})

	it('sont soumis par défaut à un PFU de 12,8%', () => {
		const e = engine.setSituation(defaultSituationAvecDividendes)

		expect(e).toEvaluate('assimilé salarié . dividendes . PFU', 128)
		expect(e).not.toBeApplicable('assimilé salarié . dividendes . imposables')
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

	it('s’ajoutent au revenu imposable en cas d’imposition au barème progressif', () => {
		const e1 = engine.shallowCopy().setSituation({
			...defaultSituationAvecDividendes,
			'assimilé salarié . dividendes . imposition': "'barème progressif'",
		})
		const rémunérationNetteImposable = e1.evaluate(
			'assimilé salarié . rémunération . nette . imposable'
		).nodeValue as number
		const dividendesImposables = e1.evaluate(
			'assimilé salarié . dividendes . imposables'
		).nodeValue as number

		// Revenu brut global = rémunération imposable abattue de 10% + dividendes imposables
		const revenuBrutGlobal =
			0.9 * rémunérationNetteImposable + dividendesImposables
		const e2 = engine.setSituation({
			'impôt . barème standard . revenu brut global': `${revenuBrutGlobal} €/an`,
			// TODO: supprimer cette ligne une fois https://github.com/betagouv/mon-entreprise/issues/2746 corrigé
			// et 'paramètres . impôt . revenu imposable' non utilisé en-dehors de 'impôt . barème standard . revenu brut global'
			'paramètres . impôt . revenu imposable': `${revenuBrutGlobal} €/an`,
		})
		const impôtAttendu = e2.evaluate('impôt . montant').nodeValue as number

		expect(e1).toEvaluate(
			'assimilé salarié . rémunération . impôt . avec dividendes',
			impôtAttendu
		)
	})
})
