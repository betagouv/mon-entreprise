import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
	"entreprise . chiffre d'affaires": '10000 €/an',
}

describe('Contribution à la formation professionnelle', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('vaut 0,25% du PASS pour le cas général', () => {
			const e = engine.setSituation(defaultSituation)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . formation professionnelle',
				118
			)
		})

		it('vaut 0,29% du PASS pour les activités artisanales', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'entreprise . activité': "'artisanale'",
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . formation professionnelle',
				137
			)
		})

		it('n’est pas proratisée en cas d’année incomplète', () => {
			const e = engine.setSituation({
				...defaultSituation,
				"entreprise . durée d'activité cette année": '250 jour',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . formation professionnelle',
				118
			)
		})
	})

	describe('pour les PLR', () => {
		it('vaut 0,25% du PASS', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'entreprise . activité': "'libérale'",
				'entreprise . activité . libérale . réglementée': 'oui',
				'indépendant . PL . régime général': 'non',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . formation professionnelle',
				118
			)
		})
	})
})
