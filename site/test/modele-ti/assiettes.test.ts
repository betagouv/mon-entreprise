import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Indépendant', () => {
	let engine: Engine
	let Pass: number
	beforeEach(() => {
		engine = new Engine(rules)

		Pass = engine.evaluate('plafond sécurité sociale . annuel')
			.nodeValue as number
	})

	describe('assiette CSG-CRDS', () => {
		it('calcule à l’IR', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IR'",
				"entreprise . chiffre d'affaires": '50000 €/an',
				'entreprise . charges': '10000 €/an',
			})

			expect(e).toEvaluate('indépendant . revenu brut', 40000)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . assiette CSG-CRDS',
				29600
			)
		})

		it('calcule à l’IS', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . brute': '40000 €/an',
			})

			expect(e).toEvaluate('indépendant . revenu brut', 40000)
			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . assiette CSG-CRDS',
				29600
			)
		})

		it('applique un abattement plafonné à 1,3 Pass', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . brute': '250000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . assiette CSG-CRDS . abattement',
				Math.round(1.3 * Pass)
			)
		})

		it('applique un abattement plancher de 1,76% du Pass', () => {
			const e = engine.setSituation({
				'entreprise . imposition': "'IS'",
				'indépendant . rémunération . brute': '1000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . assiette CSG-CRDS . abattement',
				Math.round((1.76 / 100) * Pass)
			)
		})
	})

	describe('assiette sociale', () => {
		const situationParDéfaut = {
			'entreprise . imposition': "'IS'",
			'indépendant . rémunération . brute': '40000 €/an',
		}

		it('calcule sans ajustements', () => {
			const e = engine.setSituation(situationParDéfaut)

			const assietteCSG = e.evaluate(
				'indépendant . cotisations et contributions . assiette CSG-CRDS'
			).nodeValue
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG)
		})

		it('calcule avec des revenus de remplacement', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . IJSS': 'oui',
				'indépendant . IJSS . montant': '2000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . assiette CSG-CRDS'
				).nodeValue as number) || 0
			const IJSS =
				(e.evaluate('indépendant . IJSS . après abattement')
					.nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue

			expect(IJSS).toEqual(1480)
			expect(assietteSociale).toEqual(assietteCSG + IJSS)
		})

		it('calcule avec des revenus étrangers bénéficiaires', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . revenus étrangers': 'oui',
				'indépendant . revenus étrangers . montant': '4000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . assiette CSG-CRDS'
				).nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG + 4000)
		})

		it('calcule avec des revenus étrangers déficitaires', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . revenus étrangers': 'oui',
				'indépendant . revenus étrangers . montant': '-4000 €/an',
			})

			const assietteCSG =
				(e.evaluate(
					'indépendant . cotisations et contributions . assiette CSG-CRDS'
				).nodeValue as number) || 0
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue

			expect(assietteSociale).toEqual(assietteCSG - 4000)
		})

		it('calcule en cas de domiciliation fiscale à l’étranger', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				"situation personnelle . domiciliation fiscale à l'étranger": 'oui',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . assiette sociale',
				29600
			)
		})
	})

	describe('assiette retraite et invalidité-décès', () => {
		const situationParDéfaut = {
			'indépendant . cotisations et contributions . assiette sociale':
				'60000 €/an',
		}

		it('calcule situation de base', () => {
			const e = engine.setSituation(situationParDéfaut)

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . assiette retraite et invalidité-décès',
				60_000
			)
		})

		it('calcule avec déduction tabac', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . activité . commerciale . débit de tabac': 'oui',
				'indépendant . cotisations et contributions . déduction tabac':
					'20000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . assiette retraite et invalidité-décès',
				60_000 - 20_000
			)
		})

		it('calcule avec conjoint collaborateur', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'indépendant . conjoint collaborateur': 'oui',
				'indépendant . conjoint collaborateur . choix assiette':
					"'revenu avec partage'",
				'indépendant . conjoint collaborateur . choix assiette . proportion':
					"'moitié'",
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . assiette retraite et invalidité-décès',
				60_000 / 2
			)
		})

		it('calcule avec déduction tabac et conjoint collaborateur', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'entreprise . activité . commerciale . débit de tabac': 'oui',
				'indépendant . cotisations et contributions . déduction tabac':
					'20000 €/an',
				'indépendant . conjoint collaborateur': 'oui',
				'indépendant . conjoint collaborateur . choix assiette':
					"'revenu avec partage'",
				'indépendant . conjoint collaborateur . choix assiette . proportion':
					"'moitié'",
			})

			expect(e).toEvaluate(
				'indépendant . cotisations et contributions . cotisations . assiette retraite et invalidité-décès',
				(60_000 - 20_000) / 2
			)
		})
	})
})
