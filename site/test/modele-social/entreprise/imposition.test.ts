import rules, { RègleModeleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import ISSimulationConfig from '@/pages/simulateurs/impot-societe/simulationConfig'

const situationParDéfaut = {
	...ISSimulationConfig.situation,
	'entreprise . charges': '10 k€/an',
	'dirigeant . rémunération . totale': 0,
}

describe('entreprise . imposition', () => {
	let engine: Engine<RègleModeleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('IS', () => {
		it('calcule un impôt sur les sociétés nul en cas de déficit', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"entreprise . chiffre d'affaires": '8 k€/an',
			})

			expect(e).toEvaluate(
				'entreprise . imposition . IS . résultat imposable',
				-2000
			)
			expect(e).toEvaluate('entreprise . imposition . IS . montant', 0)
			expect(e).not.toBeApplicable(
				'entreprise . imposition . IS . contribution sociale'
			)
			expect(e).toEvaluate('entreprise . imposition . IS . total', 0)
		})

		it('calcule un impôt sur les sociétés pour un résultat imposable inférieur au plafond de taux réduit', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"entreprise . chiffre d'affaires": '52.5 k€/an',
			})

			expect(e).toEvaluate(
				'entreprise . imposition . IS . résultat imposable',
				42500
			)
			expect(e).toEvaluate('entreprise . imposition . IS . montant', 6375)
			expect(e).not.toBeApplicable(
				'entreprise . imposition . IS . contribution sociale'
			)
			expect(e).toEvaluate('entreprise . imposition . IS . total', 6375)
		})

		it('calcule un impôt sur les sociétés pour un résultat imposable supérieur au plafond de taux réduit pour une entreprise exonérée de contribution sociale', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"entreprise . chiffre d'affaires": '110 k€/an',
			})

			expect(e).toEvaluate(
				'entreprise . imposition . IS . résultat imposable',
				100000
			)
			expect(e).toEvaluate('entreprise . imposition . IS . montant', 20750)
			expect(e).not.toBeApplicable(
				'entreprise . imposition . IS . contribution sociale'
			)
			expect(e).toEvaluate('entreprise . imposition . IS . total', 20750)
		})

		it('calcule un impôt sur les sociétés pour un résultat imposable supérieur au plafond de taux réduit pour une entreprise soumise à la contribution sociale et éligible au taux réduit', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"entreprise . chiffre d'affaires": '9010 k€/an',
			})

			expect(e).toEvaluate(
				'entreprise . imposition . IS . résultat imposable',
				9000000
			)
			expect(e).toEvaluate('entreprise . imposition . IS . montant', 2245750)
			expect(e).toBeApplicable(
				'entreprise . imposition . IS . contribution sociale'
			)
			expect(e).toEvaluate(
				'entreprise . imposition . IS . contribution sociale',
				48931
			)
			expect(e).toEvaluate('entreprise . imposition . IS . total', 2294681)
		})

		it('calcule un impôt sur les sociétés pour un résultat imposable supérieur au plafond de taux réduit pour une entreprise soumise à la contribution sociale et non éligible au taux réduit', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"entreprise . chiffre d'affaires": '10010 k€/an',
			})

			expect(e).toEvaluate(
				'entreprise . imposition . IS . résultat imposable',
				10000000
			)
			expect(e).toEvaluate('entreprise . imposition . IS . montant', 2500000)
			expect(e).toBeApplicable(
				'entreprise . imposition . IS . contribution sociale'
			)
			expect(e).toEvaluate(
				'entreprise . imposition . IS . contribution sociale',
				57321
			)
			expect(e).toEvaluate('entreprise . imposition . IS . total', 2557321)
		})
	})
})
