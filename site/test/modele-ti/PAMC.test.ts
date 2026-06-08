import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const defaultSituation = {
	'entreprise . activité': "'libérale'",
	'entreprise . activité . libérale . réglementée': 'oui',
	'indépendant . profession libérale . réglementée . métier':
		"'santé . médecin'",
	'entreprise . imposition': "'IR'",
	"entreprise . chiffre d'affaires": '100000 €/an',
}

describe('PAMC', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('l’assiette de participation de la CPAM', () => {
		const ASSIETTE_CPAM =
			'indépendant . profession libérale . réglementée . PAMC . assiette participation CPAM'

		it('vaut l’assiette sociale en l’absence de revenus non conventionnés et de dépassements d’honoraires', () => {
			const e = engine.setSituation(defaultSituation)
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue as number

			expect(e).toEvaluate(ASSIETTE_CPAM, assietteSociale)
		})

		it('vaut l’assiette sociale conventionnée en l’absence de dépassements d’honoraires', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . profession libérale . réglementée . PAMC . recettes activité conventionnée':
					'80000 €/an',
			})
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue as number
			const assietteSocialeConventionnée = e.evaluate(
				'indépendant . profession libérale . réglementée . PAMC . assiette sociale conventionnée'
			).nodeValue as number

			expect(assietteSocialeConventionnée).toEqual(
				Math.round((assietteSociale * 80_000) / 100_000)
			)
			expect(e).toEvaluate(ASSIETTE_CPAM, assietteSocialeConventionnée)
		})

		it('vaut l’assiette sociale conventionnée nette de dépassements d’honoraires', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . profession libérale . réglementée . PAMC . recettes activité conventionnée':
					'80000 €/an',
				"indépendant . profession libérale . réglementée . PAMC . dépassements d'honoraire":
					'30000 €/an',
			})
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue as number
			const assietteSocialeConventionnée = e.evaluate(
				'indépendant . profession libérale . réglementée . PAMC . assiette sociale conventionnée'
			).nodeValue as number

			expect(assietteSocialeConventionnée).toEqual(
				Math.round((assietteSociale * 80_000) / 100_000)
			)
			expect(e).toEvaluate(
				ASSIETTE_CPAM,
				(assietteSocialeConventionnée * (80_000 - 30_000)) / 80_000
			)
		})

		it('n’est pas recadrée en cas d’exonération invalidité', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité':
					'oui',
				'indépendant . cotisations et contributions . cotisations . exonérations . invalidité . durée':
					'9 mois',
			})
			const assietteSociale = e.evaluate(
				'indépendant . cotisations et contributions . assiette sociale'
			).nodeValue as number

			expect(e).toEvaluate(ASSIETTE_CPAM, assietteSociale)
		})

		it('n’est pas applicable à Mayotte', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'établissement . commune . département': "'Mayotte'",
			})

			expect(e).not.toBeApplicable(ASSIETTE_CPAM)
		})
	})

	describe('les cotisations forfaitaires de début d’activité', () => {
		describe('au régime réel de l’IR', () => {
			it('ne sont pas applicables en cas d’entreprise créée avant l’année en cours', () => {
				const e = engine.setSituation(defaultSituation)

				expect(e).not.toBeApplicable(
					'indépendant . cotisations et contributions . début activité'
				)
			})

			it('sont applicables en cas d’entreprise créée l’année en cours', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . date de création': '01/01/2026',
				})

				expect(e).toBeApplicable(
					'indépendant . cotisations et contributions . début activité'
				)
			})
		})

		describe('au régime micro-fiscal', () => {
			it('ne sont pas applicables en cas d’entreprise créée avant l’année en cours', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . imposition . IR . régime micro-fiscal': 'oui',
				})

				expect(e).not.toBeApplicable(
					'indépendant . cotisations et contributions . début activité'
				)
			})

			it('sont applicables en cas d’entreprise créée l’année en cours', () => {
				const e = engine.setSituation({
					...defaultSituation,
					'entreprise . imposition . IR . régime micro-fiscal': 'oui',
					'entreprise . date de création': '01/01/2026',
				})

				expect(e).toBeApplicable(
					'indépendant . cotisations et contributions . début activité'
				)
			})
		})
	})

	describe('la Curps', () => {
		it('n’est pas redevable en cas d’entreprise créée après le 1er janvier', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'entreprise . date de création': '02/01/2026',
			})

			expect(e).not.toBeApplicable(
				'indépendant . profession libérale . réglementée . PAMC . CURPS'
			)
		})

		it('n’est pas redevable par les médecins non conventionnés', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . profession libérale . réglementée . métier . santé . médecin . secteur':
					"'non conventionné'",
			})

			expect(e).not.toBeApplicable(
				'indépendant . profession libérale . réglementée . PAMC . CURPS'
			)
		})

		it('applique un taux de 0,5% pour les médecins', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . profession libérale . réglementée . PAMC . CURPS',
				Math.round((30_000 * 0.5) / 100)
			)
		})

		it('applique un taux de 0,3% pour les dentistes', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . profession libérale . réglementée . métier':
					"'santé . chirurgien-dentiste'",
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . profession libérale . réglementée . PAMC . CURPS',
				Math.round((30_000 * 0.3) / 100)
			)
		})

		it('applique un taux de 0,1% pour les autres professions', () => {
			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . profession libérale . réglementée . métier':
					"'santé . sage-femme'",
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . profession libérale . réglementée . PAMC . CURPS',
				Math.round((30_000 * 0.1) / 100)
			)
		})

		it('est plafonnée à 0,5% du PASS', () => {
			const PASS = engine.evaluate('plafond sécurité sociale . annuel')
				.nodeValue as number

			const e = engine.setSituation({
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'50000 €/an',
			})

			expect(e).toEvaluate(
				'indépendant . profession libérale . réglementée . PAMC . CURPS',
				Math.round((PASS * 0.5) / 100)
			)
		})

		describe('pour Mayotte', () => {
			const situation = {
				...defaultSituation,
				'indépendant . cotisations et contributions . assiette sociale':
					'30000 €/an',
				'établissement . commune . département': "'Mayotte'",
			}
			it('applique un taux de 0,5% pour les médecins', () => {
				const e = engine.setSituation(situation)

				expect(e).toEvaluate(
					'indépendant . profession libérale . réglementée . PAMC . CURPS',
					Math.round((30_000 * 0.5) / 100)
				)
			})

			it('applique un taux de 0,3% pour les dentistes', () => {
				const e = engine.setSituation({
					...situation,
					'indépendant . profession libérale . réglementée . métier':
						"'santé . chirurgien-dentiste'",
				})

				expect(e).toEvaluate(
					'indépendant . profession libérale . réglementée . PAMC . CURPS',
					Math.round((30_000 * 0.3) / 100)
				)
			})

			it('applique un taux de 0,1% pour les autres professions', () => {
				const e = engine.setSituation({
					...situation,
					'indépendant . profession libérale . réglementée . métier':
						"'santé . sage-femme'",
				})

				expect(e).toEvaluate(
					'indépendant . profession libérale . réglementée . PAMC . CURPS',
					Math.round((30_000 * 0.1) / 100)
				)
			})

			it('est plafonnée à 0,5% du PASS métropole', () => {
				const PASS = engine.evaluate('plafond sécurité sociale . annuel')
					.nodeValue as number

				const e = engine.setSituation({
					...situation,
					'indépendant . cotisations et contributions . assiette sociale':
						'50000 €/an',
				})

				expect(e).toEvaluate(
					'indépendant . profession libérale . réglementée . PAMC . CURPS',
					Math.round((PASS * 0.5) / 100)
				)
			})
		})
	})
})
