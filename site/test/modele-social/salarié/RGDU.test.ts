import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationParDéfaut = {
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
	'salarié . cotisations . assiette': '2200 €/mois',
}

describe('Réduction générale dégressive unique', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('utilise le Smic au 1er janvier 2026', () => {
		const e = engine.setSituation(situationParDéfaut)
		const Smic = engine.evaluate({
			valeur: 'SMIC',
			contexte: {
				date: '01/01/2026',
			},
		}).nodeValue

		expect(e).toEvaluate(
			'salarié . cotisations . exonérations . RGDU . SMIC',
			Smic
		)
	})

	describe('Situation de base', () => {
		it('Calcul de la réduction', () => {
			const e = engine.setSituation(situationParDéfaut)

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . RGDU',
				538.56
			)
		})

		it('Salaire supérieur à 3 Smic', () => {
			const Smic = engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					date: '01/01/2026',
				},
			}).nodeValue as number
			const e = engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': `${Math.ceil(3 * Smic)} €/mois`,
			})

			expect(e).not.toBeApplicable(
				'salarié . cotisations . exonérations . RGDU'
			)
		})
	})

	describe('À Mayotte', () => {
		const situationMayotte = {
			...situationParDéfaut,
			'établissement . commune . département': "'Mayotte'",
		}
		const SmicMahorais = (engine: Engine<RègleModèleSocial>, date: string) =>
			engine.evaluate({
				valeur: 'SMIC',
				contexte: {
					'établissement . commune . département': "'Mayotte'",
					date,
				},
			}).nodeValue as number

		// Exemple publié par l'Urssaf : 10 salariés, juin 2026, 35 heures par
		// semaine, mois complet, Smic mahorais de 1 449,93 € et rémunération de
		// 1 600 € — soit un cœfficient de 0,1836.
		it('reproduit l’exemple de l’Urssaf de juin 2026', () => {
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

		it('s’applique avant l’ouverture de l’exonération Lodeom', () => {
			const e = engine.setSituation({
				...situationMayotte,
				date: '03/2026',
				'salarié . cotisations . assiette': '1600 €/mois',
			})

			expect(e).not.toBeApplicable(
				'salarié . cotisations . exonérations . lodeom'
			)
			expect(
				e.evaluate('salarié . cotisations . exonérations . RGDU').nodeValue
			).toBeCloseTo(271.04, 2)
		})

		it('retient le Smic mahorais de la période, et non celui du 1er janvier', () => {
			const SmicDeJuin = SmicMahorais(engine, '06/2026')
			expect(SmicDeJuin).not.toEqual(SmicMahorais(engine, '01/01/2026'))

			const e = engine.setSituation({ ...situationMayotte, date: '06/2026' })

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . RGDU . SMIC',
				SmicDeJuin
			)
		})

		it('ne s’applique plus à partir de 1,6 Smic', () => {
			const Smic = SmicMahorais(engine, '06/2026')

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
			['10', 0.2449],
			['50', 0.2489],
		])(
			'plafonne le cœfficient à %s salariés à %s au niveau du Smic',
			(effectif, coefficientMaximal) => {
				const Smic = SmicMahorais(engine, '06/2026')

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

		// Depuis juillet 2026 le Lodeom couvre les employeurs mahorais de moins de
		// 11 salariés et les secteurs éligibles, et prime alors sur la RGDU. Les
		// autres ne relèvent d’aucun de ses barèmes : la RGDU est leur seul
		// allègement, et ils ne bénéficient pas des taux réduits qui lui sont
		// réservés.
		it('s’applique à l’employeur qui ne relève d’aucun barème Lodeom', () => {
			const e = engine.setSituation({
				dirigeant: 'non',
				'entreprise . catégorie juridique': "''",
				'entreprise . imposition': 'non',
				'établissement . commune . département': "'Mayotte'",
				'salarié . contrat . salaire brut': '1500 €/mois',
				date: '08/2026',
				'entreprise . salariés . effectif . seuil': "'moins de 20'",
				"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles":
					'non',
				'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée':
					'non',
				'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance':
					'non',
			})

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . lodeom . barème applicable',
				false
			)
			expect(
				e.evaluate('salarié . cotisations . exonérations . employeur').nodeValue
			).toBeCloseTo(334.65, 2)
			// Les taux réduits sont réservés aux bénéficiaires du Lodeom
			expect(e).toEvaluate(
				'salarié . cotisations . maladie . employeur . taux',
				5.8
			)
			expect(e).toEvaluate(
				'salarié . cotisations . allocations familiales . taux',
				5.4
			)
		})
	})

	describe('Modifications des paramètres de calcul', () => {
		let réductionDeBase: number
		beforeEach(() => {
			engine.setSituation(situationParDéfaut)
			réductionDeBase = engine.evaluate(
				'salarié . cotisations . exonérations . RGDU'
			).nodeValue as number
		})

		it('Taille de l’entreprise', () => {
			engine.setSituation({
				...situationParDéfaut,
				'entreprise . salariés . effectif': '49',
			})
			const réductionÀ49 = engine.evaluate(
				'salarié . cotisations . exonérations . RGDU'
			).nodeValue as number

			expect(réductionDeBase).toEqual(réductionÀ49)

			engine.setSituation({
				...situationParDéfaut,
				'entreprise . salariés . effectif': '50',
			})
			const réductionÀ50 = Math.round(
				engine.evaluate('salarié . cotisations . exonérations . RGDU')
					.nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionÀ50)
			expect(réductionÀ50).toEqual(544)
		})

		it('Obligation de cotiser à une caisse de congés payés', () => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . exonérations . RGDU . caisse de congés payés':
					'oui',
			})
			const réductionAvecCCP = Math.round(
				engine.evaluate('salarié . cotisations . exonérations . RGDU')
					.nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionAvecCCP)
			expect(réductionAvecCCP).toEqual(Math.round((réductionDeBase * 100) / 90))
		})
	})
})
