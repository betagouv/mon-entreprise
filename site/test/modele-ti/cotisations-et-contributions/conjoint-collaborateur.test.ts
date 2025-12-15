import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'indépendant . conjoint collaborateur': 'oui',
}

describe('Cotisations du conjoint collaborateur', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('indemnité journalières = 40% du PASS x taux de 0,5%', () => {
			const e = engine.setSituation(defaultSituation)

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . indemnités journalières'
			).nodeValue as number
			expect(assietteMinimale).toEqual(18840)

			expect(e).toEvaluate(
				'indépendant . conjoint collaborateur . cotisations . indemnités journalières',
				Math.round((assietteMinimale * 0.5) / 100)
			)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('indemnité journalières = 40% du PASS x taux de 0,3%', () => {
			const e = engine.setSituation(defaultSituationPLR)

			const assietteMinimale = e.evaluate(
				'indépendant . assiette minimale . indemnités journalières'
			).nodeValue as number
			expect(assietteMinimale).toEqual(18840)

			expect(e).toEvaluate(
				'indépendant . conjoint collaborateur . cotisations . indemnités journalières',
				Math.round((assietteMinimale * 0.3) / 100)
			)
		})
	})
})
