import fc from 'fast-check'
import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const PROPERTY_TEST_TIMEOUT = 30_000

const situationParDéfaut = {
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . cotisations . assiette': '2200 €/mois',
}

const montant = (engine: Engine<RègleModèleSocial>, règle: string) => {
	const valeur = engine.evaluate(règle).nodeValue

	return typeof valeur === 'number' ? valeur : null
}

describe('Réduction générale dégressive unique', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const SmicAuPremierJanvier = () =>
		engine.evaluate({
			valeur: 'SMIC',
			contexte: {
				date: '01/01/2026',
			},
		}).nodeValue as number

	const réduction = (situation: Record<string, string> = {}) =>
		engine
			.setSituation({ ...situationParDéfaut, ...situation })
			.evaluate('salarié . cotisations . exonérations . RGDU')
			.nodeValue as number

	it('utilise le Smic au 1er janvier 2026', () => {
		const e = engine.setSituation(situationParDéfaut)

		expect(e).toEvaluate(
			'salarié . cotisations . exonérations . RGDU . SMIC',
			SmicAuPremierJanvier()
		)
	})

	it('réduit de 538,56 € les cotisations d’une assiette de 2 200 € par mois', () => {
		const e = engine.setSituation(situationParDéfaut)

		expect(e).toEvaluate('salarié . cotisations . exonérations . RGDU', 538.56)
	})

	it('ne s’applique plus à partir de 3 Smic', () => {
		const e = engine.setSituation({
			...situationParDéfaut,
			'salarié . cotisations . assiette': `${Math.ceil(
				3 * SmicAuPremierJanvier()
			)} €/mois`,
		})

		expect(e).not.toBeApplicable('salarié . cotisations . exonérations . RGDU')
	})

	it('est majorée de 1 / 0,9 quand l’employeur cotise à une caisse de congés payés', () => {
		const avecCaisse = réduction({
			'salarié . cotisations . exonérations . RGDU . caisse de congés payés':
				'oui',
		})

		expect(Math.round(avecCaisse)).toEqual(Math.round((réduction() * 100) / 90))
	})

	describe('Selon l’effectif de l’entreprise', () => {
		it('reste inchangée en-dessous de 50 salariés', () => {
			expect(réduction({ 'entreprise . salariés . effectif': '49' })).toEqual(
				réduction()
			)
		})

		it('est majorée à partir de 50 salariés', () => {
			const à49 = réduction({ 'entreprise . salariés . effectif': '49' })
			const à50 = réduction({ 'entreprise . salariés . effectif': '50' })

			expect(à50).toBeGreaterThan(à49)
			expect(Math.round(à50)).toEqual(544)
		})
	})

	describe('À Mayotte', () => {
		const situationMayotte = {
			...situationParDéfaut,
			'établissement . commune . département': "'Mayotte'",
		}
		const SmicMahorais = (date: string) =>
			engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date,
				},
			}).nodeValue as number

		it('reproduit l’exemple de l’Urssaf : 10 salariés, juin 2026, 1 600 € de rémunération, cœfficient 0,1836', () => {
			const e = engine.setSituation({
				...situationMayotte,
				date: '06/2026',
				'entreprise . salariés . effectif': '10',
				'salarié . cotisations . assiette': '1600 €/mois',
			})

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . RGDU . coefficient',
				0.1836
			)
			expect(
				e.evaluate('salarié . cotisations . exonérations . RGDU').nodeValue
			).toBeCloseTo(293.76, 2)
		})

		it('retient le Smic mahorais de la période, et non celui du 1er janvier', () => {
			const SmicDeJuin = SmicMahorais('06/2026')
			expect(SmicDeJuin).not.toEqual(SmicMahorais('01/01/2026'))

			const e = engine.setSituation({ ...situationMayotte, date: '06/2026' })

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . RGDU . SMIC',
				SmicDeJuin
			)
		})

		it('ne s’applique plus à partir de 1,6 Smic', () => {
			const Smic = SmicMahorais('06/2026')

			expect(
				engine.setSituation({
					...situationMayotte,
					date: '06/2026',
					'salarié . cotisations . assiette': `${Math.floor(1.6 * Smic)} €/mois`,
				})
			).toBeApplicable('salarié . cotisations . exonérations . RGDU')

			expect(
				engine.setSituation({
					...situationMayotte,
					date: '06/2026',
					'salarié . cotisations . assiette': `${Math.ceil(1.6 * Smic)} €/mois`,
				})
			).not.toBeApplicable('salarié . cotisations . exonérations . RGDU')
		})

		it.each([
			[0.2449, '10'],
			[0.2489, '50'],
		])(
			'plafonne le cœfficient à %s au niveau du Smic, pour un effectif de %s salariés',
			(coefficientMaximal, effectif) => {
				const Smic = SmicMahorais('06/2026')

				const e = engine.setSituation({
					...situationMayotte,
					date: '06/2026',
					'entreprise . salariés . effectif': effectif,
					'salarié . cotisations . assiette': `${Smic} €/mois`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . RGDU . coefficient',
					coefficientMaximal
				)
			}
		)

		it(
			'voit son cœfficient décroître quand l’assiette augmente',
			() => {
				const coefficient = (assiette: number) =>
					montant(
						engine.setSituation({
							...situationMayotte,
							date: '06/2026',
							'salarié . cotisations . assiette': `${assiette} €/mois`,
						}),
						'salarié . cotisations . exonérations . RGDU . coefficient'
					)

				fc.assert(
					fc.property(
						fc.integer({ min: 1450, max: 2200 }),
						fc.integer({ min: 10, max: 100 }),
						(assiette, écart) => {
							const bas = coefficient(assiette)
							const haut = coefficient(assiette + écart)

							if (bas === null || haut === null) return

							expect(haut).toBeLessThanOrEqual(bas)
						}
					),
					{ numRuns: 20 }
				)
			},
			PROPERTY_TEST_TIMEOUT
		)
	})
})
