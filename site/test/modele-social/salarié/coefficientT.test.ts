import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationParDéfaut = {
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . rémunération . brut': '3500 €/mois',
}
const situationZone1 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone un'",
}
const situationMayotte = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'mayotte'",
	'salarié . rémunération . brut': '3000 €/mois',
}
const situationZone2 = {
	...situationParDéfaut,
	'salarié . cotisations . exonérations . zones lodeom': "'zone deux'",
}

describe('Coefficient T', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('En zone un (Guadeloupe, Guyane, Martinique, La Réunion)', () => {
		describe('Pour les entreprises de moins de 50 salarié⋅es', () => {
			it.each([
				'compétitivité',
				'compétitivité renforcée',
				'innovation et croissance',
			])('vaut 0,3201 pour le barème %s', (barème) => {
				const e = engine.setSituation({
					...situationZone1,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.3201)
			})
		})

		describe('Pour les entreprises de plus de 50 salarié⋅es', () => {
			it.each([
				'compétitivité',
				'compétitivité renforcée',
				'innovation et croissance',
			])('vaut 0,3241 pour le barème %s', (barème) => {
				const e = engine.setSituation({
					...situationZone1,
					'entreprise . salariés . effectif': '50',
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.3241)
			})
		})
	})

	describe('À Mayotte', () => {
		describe('Pour les entreprises de moins de 50 salarié⋅es', () => {
			it.each([
				'compétitivité',
				'compétitivité renforcée',
				'innovation et croissance',
			])('vaut 0,1996 pour le barème %s', (barème) => {
				const e = engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . lodeom . mayotte',
					true
				)
				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.1996)
			})

			it('vaut 0,2449 pour le barème innovation et croissance avec une rémunération supérieure à 3,5 fois le Smic au 31/12/2023', () => {
				const e = engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'innovation et croissance'",
					'salarié . rémunération . brut': '4800 €/mois',
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.2449)
			})
		})

		describe('Pour les entreprises de plus de 50 salarié⋅es', () => {
			it.each([
				'compétitivité',
				'compétitivité renforcée',
				'innovation et croissance',
			])('vaut 0,2036 pour le barème %s', (barème) => {
				const e = engine.setSituation({
					...situationMayotte,
					'entreprise . salariés . effectif': '50',
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.2036)
			})

			it('vaut 0,2489 pour le barème innovation et croissance avec une rémunération supérieure à 3,5 fois le Smic au 31/12/2023', () => {
				const e = engine.setSituation({
					...situationMayotte,
					'entreprise . salariés . effectif': '50',
					'salarié . cotisations . exonérations . lodeom . zone un . barèmes':
						"'innovation et croissance'",
					'salarié . rémunération . brut': '4800 €/mois',
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.2489)
			})
		})
	})

	describe('En zone deux (Saint-Barthélémy, Saint-Martin)', () => {
		it.each(['moins de 11 salariés', 'sectoriel', 'renforcé'])(
			'vaut 0,2111 pour le barème %s',
			(barème) => {
				const e = engine.setSituation({
					...situationZone2,
					'salarié . cotisations . exonérations . lodeom . zone deux . barèmes': `"${barème}"`,
				})

				expect(e).toEvaluate('salarié . cotisations . exonérations . T', 0.2111)
			}
		)
	})
})
