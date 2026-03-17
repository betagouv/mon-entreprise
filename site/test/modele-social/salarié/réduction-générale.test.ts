import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { configRéductionGénérale } from '@/pages/simulateurs/reduction-generale/simulationConfig'

const situationParDéfaut = configRéductionGénérale.situation

describe('Réduction générale des cotisations patronales', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('Situation de base', () => {
		it('Calcul de la réduction et de sa répartition', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
			})

			expect(e).toEvaluate(
				{
					valeur: 'salarié . cotisations . exonérations . réduction générale',
					arrondi: '2 décimales',
				},
				542.64
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation retraite complémentaire',
				101.85
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation sécurité sociale',
				440.79
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation chômage',
				67.79
			)
		})

		it('Salaire supérieur à 1,6 Smic', () => {
			const e = engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '2917 €/mois',
			})

			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale',
				0
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation retraite complémentaire',
				0
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation sécurité sociale',
				0
			)
			expect(e).toEvaluate(
				'salarié . cotisations . exonérations . réduction générale . imputation chômage',
				0
			)
		})
	})

	describe('Modifications des paramètres de calcul', () => {
		let réductionDeBase: number
		beforeEach(() => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
			})
			réductionDeBase = engine.evaluate(
				'salarié . cotisations . exonérations . réduction générale'
			).nodeValue as number
		})

		it('Taille de l’entreprise', () => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'entreprise . salariés . effectif': '49',
			})
			const réductionÀ49 = engine.evaluate(
				'salarié . cotisations . exonérations . réduction générale'
			).nodeValue as number

			expect(réductionDeBase).toEqual(réductionÀ49)

			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'entreprise . salariés . effectif': '50',
			})
			const réductionÀ50 = Math.round(
				engine.evaluate(
					'salarié . cotisations . exonérations . réduction générale'
				).nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionÀ50)
			expect(réductionÀ50).toEqual(549)
		})

		it('Obligation de cotiser à une caisse de congés payés', () => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'salarié . cotisations . exonérations . réduction générale . caisse de congés payés':
					'oui',
			})
			const réductionAvecCCP = Math.round(
				engine.evaluate(
					'salarié . cotisations . exonérations . réduction générale'
				).nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionAvecCCP)
			expect(réductionAvecCCP).toEqual(603)
		})
	})
})
