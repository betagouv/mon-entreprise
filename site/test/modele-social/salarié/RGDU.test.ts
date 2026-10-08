import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationParDéfaut = {
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . cotisations . assiette': '2000 €/mois',
}

describe('Réduction générale dégressive unique', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const réduction = (situation: Record<string, string> = {}) =>
		engine
			.setSituation({ ...situationParDéfaut, ...situation })
			.evaluate('salarié . cotisations . exonérations . RGDU')
			.nodeValue as number

	it('utilise le Smic au 1er janvier 2026', () => {
		const SmicAuPremierJanvier = engine.evaluate({
			valeur: 'SMIC',
			contexte: {
				date: '01/01/2026',
			},
		}).nodeValue as number

		const e = engine.setSituation(situationParDéfaut)

		expect(e).toEvaluate(
			'salarié . cotisations . exonérations . RGDU . SMIC',
			SmicAuPremierJanvier
		)
	})

	it('reproduit l’exemple de l’Urssaf : 70 salariés, juin 2026, 2 000 € de rémunération, cœfficient 0,3178', () => {
		const e = engine.setSituation({
			...situationParDéfaut,
			date: '06/2026',
			'entreprise . salariés . effectif': '70',
			'salarié . cotisations . assiette': '2000 €/mois',
		})

		expect(e).toEvaluate(
			'salarié . cotisations . exonérations . RGDU . coefficient',
			0.3178
		)
		expect(e).toEvaluate('salarié . cotisations . exonérations . RGDU', 635.6)
	})

	it('ne s’applique plus à partir de 3 Smic (applicable au 1er janvier)', () => {
		const Smic = engine.evaluate({
			valeur: 'SMIC',
			contexte: {
				date: '01/01/2026',
			},
		}).nodeValue as number

		expect(
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': `${Math.floor(3 * Smic)} €/mois`,
			})
		).toBeApplicable('salarié . cotisations . exonérations . RGDU')

		expect(
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': `${Math.ceil(3 * Smic)} €/mois`,
			})
		).not.toBeApplicable('salarié . cotisations . exonérations . RGDU')
	})

	it('est majorée de 100 / 90 quand l’employeur cotise à une caisse de congés payés', () => {
		const avecCaisse = réduction({
			'salarié . cotisations . exonérations . RGDU . caisse de congés payés':
				'oui',
		})

		expect(avecCaisse).toBeCloseTo((réduction() * 100) / 90, 0)
	})

	describe('Selon l’effectif de l’entreprise', () => {
		it('reste inchangée en-dessous de 50 salariés', () => {
			const à1 = réduction({ 'entreprise . salariés . effectif': '1' })
			const à49 = réduction({ 'entreprise . salariés . effectif': '49' })

			expect(à1).toEqual(à49)
		})

		it('est majorée à partir de 50 salariés', () => {
			const à49 = réduction({ 'entreprise . salariés . effectif': '49' })
			const à50 = réduction({ 'entreprise . salariés . effectif': '50' })

			expect(à50).toBeGreaterThan(à49)
		})

		it('reste inchangée au-dessus de 50 salariés', () => {
			const à50 = réduction({ 'entreprise . salariés . effectif': '50' })
			const à500 = réduction({ 'entreprise . salariés . effectif': '500' })

			expect(à50).toEqual(à500)
		})
	})

	describe('À Mayotte', () => {
		const situationMayotte = {
			...situationParDéfaut,
			'établissement . commune . département': "'Mayotte'",
		}

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
			const SmicAu1erJanvier = engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date: '01/01/2026',
				},
			}).nodeValue as number
			const SmicDeJuin = engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date: '06/2026',
				},
			}).nodeValue as number

			expect(SmicDeJuin).not.toEqual(SmicAu1erJanvier)

			const e = engine.setSituation({ ...situationMayotte, date: '06/2026' })

			expect(e).toBeApplicable('salarié . cotisations . exonérations . RGDU')
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . RGDU . SMIC',
				SmicDeJuin
			)
		})

		it('ne s’applique plus à partir de 1,6 Smic', () => {
			const Smic = engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date: '06/2026',
				},
			}).nodeValue as number

			expect(
				engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . assiette': `${Math.floor(1.6 * Smic)} €/mois`,
					date: '06/2026', // On fixe la date en juin car à partir de juillet la Lodeom est applicable et rend la RGDU non applicable
				})
			).toBeApplicable('salarié . cotisations . exonérations . RGDU')

			expect(
				engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . assiette': `${Math.ceil(1.6 * Smic)} €/mois`,
					date: '06/2026',
				})
			).not.toBeApplicable('salarié . cotisations . exonérations . RGDU')
		})

		it.each([
			[0.2449, '10'],
			[0.2489, '50'],
		])(
			'plafonne le cœfficient à %s au niveau du Smic, pour un effectif de %s salariés',
			(coefficientMaximal, effectif) => {
				const Smic = engine.evaluate({
					valeur: 'SMIC',
					contexte: {
						'établissement . commune . département': "'Mayotte'",
					},
				}).nodeValue as number

				const e = engine.setSituation({
					...situationMayotte,
					'entreprise . salariés . effectif': effectif,
					'salarié . cotisations . assiette': `${Smic} €/mois`,
				})

				expect(e).toEvaluate(
					'salarié . cotisations . exonérations . RGDU . coefficient',
					coefficientMaximal
				)
			}
		)

		it('voit son cœfficient décroître quand l’assiette augmente', () => {
			const coefficient = (assiette: number) => {
				const e = engine.setSituation({
					...situationMayotte,
					'salarié . cotisations . assiette': `${assiette} €/mois`,
				})

				return e.evaluate(
					'salarié . cotisations . exonérations . RGDU . coefficient'
				).nodeValue as number
			}

			expect(coefficient(1450)).toBeGreaterThan(coefficient(1700))
			expect(coefficient(1700)).toBeGreaterThan(coefficient(1950))
			expect(coefficient(1950)).toBeGreaterThan(coefficient(2200))
		})
	})
})
