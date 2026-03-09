import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const CSG_CRDS = 'indépendant . cotisations et contributions . CSG-CRDS'

const TAUX = 9.7 / 100

describe('CSG-CRDS', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('pour les artisans, commerçants et PLNR', () => {
		it('applique un taux de 9,7% dans le cas général', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
			})

			const tauxDéductible = e.evaluate(`${CSG_CRDS} . déductible . taux`)
				.nodeValue as number
			const tauxNonDéductible = e.evaluate(
				`${CSG_CRDS} . non déductible . taux`
			).nodeValue as number
			expect(tauxDéductible + tauxNonDéductible).toEqual(100 * TAUX)

			expect(e).toEvaluate(CSG_CRDS, Math.round(50_000 * TAUX))
		})

		it('applique un taux de 9,7% en cas d’année incomplète', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"entreprise . durée d'activité cette année": '250 jour',
			})

			expect(e).toEvaluate(CSG_CRDS, Math.round(50_000 * TAUX))
		})

		it('ne s’applique pas en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).not.toBeApplicable(CSG_CRDS)
		})
	})

	describe('pour les PLR', () => {
		const defaultSituation = {
			'entreprise . activité': "'libérale'",
			'entreprise . activité . libérale . réglementée': 'oui',
		}

		it('applique un taux de 9,7%', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
			})

			const tauxDéductible = e.evaluate(`${CSG_CRDS} . déductible . taux`)
				.nodeValue as number
			const tauxNonDéductible = e.evaluate(
				`${CSG_CRDS} . non déductible . taux`
			).nodeValue as number
			expect(tauxDéductible + tauxNonDéductible).toEqual(100 * TAUX)

			expect(e).toEvaluate(CSG_CRDS, Math.round(50_000 * TAUX))
		})

		it('ne s’applique pas en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette CSG-CRDS':
					'50000 €/an',
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).not.toBeApplicable(CSG_CRDS)
		})
	})
})
