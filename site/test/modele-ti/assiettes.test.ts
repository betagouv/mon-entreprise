import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import rules from '../../../modele-ti/dist/index.js'

describe('Indépendant', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('calcule l’assiette CSG-CRDS', () => {
		it('à l’IR', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IR'",
				"entreprise . chiffre d'affaires": '50000 €/an',
				'entreprise . charges': '10000 €/an',
			})

			expect(e).toEvaluate('indépendant . revenu brut', 40000)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette',
				29600
			)
		})

		it('à l’IS', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . totale': '40000 €/an',
			})

			expect(e).toEvaluate('indépendant . revenu brut', 40000)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette',
				29600
			)
		})

		it('avec un abattement plafonné', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . totale': '250000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette . abattement',
				61230
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette',
				188770
			)
		})

		it('avec un abattement plancher', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . totale': '1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette . abattement',
				829
			)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette',
				171
			)
		})
	})

	describe('calcule l’assiette sociale', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IS'",
			'indépendant . rémunération . totale': '40000 €/an',
		}

		it('sans ajustements', () => {
			const e = engine.setSituation(situationParDéfaut)

			const assietteCSG = e.evaluate(
				'indépendant . cotisations et contributions . CSG-CRDS . assiette'
			).nodeValue
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG)
		})

		it('avec des revenus de remplacement', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . IJSS': 'oui',
				'indépendant . IJSS . montant': '2000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . CSG-CRDS . assiette'
				).nodeValue as number) || 0
			const IJSS =
				(e.evaluate('indépendant . IJSS . après abattement')
					.nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . assiette sociale'
			).nodeValue

			expect(IJSS).toEqual(1480)
			expect(assietteSociale).toEqual(assietteCSG + IJSS)
		})

		it('avec des revenus étrangers bénéficiaires', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . revenus étrangers': 'oui',
				'indépendant . revenus étrangers . montant': '4000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . CSG-CRDS . assiette'
				).nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG + 4000)
		})

		it('avec des revenus étrangers déficitaires', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . revenus étrangers': 'oui',
				'indépendant . revenus étrangers . montant': '-4000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . CSG-CRDS . assiette'
				).nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . cotisations . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG - 4000)
		})
	})
})
