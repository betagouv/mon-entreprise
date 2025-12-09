import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'plafond sécurité sociale': '47100 €/an',
	'entreprise . imposition': "'IR'",
}

describe('CSG-CRDS', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('applique un taux de 9,7% dans le cas général', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
			})

			const tauxDéductible = e.evaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . déductible . taux'
			).nodeValue as number
			const tauxNonDéductible = e.evaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . non déductible . taux'
			).nodeValue as number
			expect(tauxDéductible + tauxNonDéductible).toEqual(9.7)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS',
				4850
			)
		})

		it('applique un taux de 9,7% en cas d’année incomplète', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"entreprise . durée d'activité cette année": '250 jour',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS',
				4850
			)
		})

		it('ne s’applique pas en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).not.toBeApplicable(
				'indépendant . cotisations et contributions . CSG-CRDS'
			)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituationPLR = {
			...defaultSituation,
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
			'indépendant . PL . régime général': 'non',
		}

		it('applique un taux de 9,7%', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
			})

			const tauxDéductible = e.evaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . déductible . taux'
			).nodeValue as number
			const tauxNonDéductible = e.evaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . non déductible . taux'
			).nodeValue as number
			expect(tauxDéductible + tauxNonDéductible).toEqual(9.7)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS',
				4850
			)
		})

		it('ne s’applique pas en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				...defaultSituationPLR,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).not.toBeApplicable(
				'indépendant . cotisations et contributions . CSG-CRDS'
			)
		})
	})
})
