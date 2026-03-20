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
	})
})
