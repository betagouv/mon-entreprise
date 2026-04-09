import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationParDéfaut = {
	dirigeant: 'non',
	'entreprise . catégorie juridique': "''",
	'entreprise . imposition': 'non',
}

describe('Réduction générale dégressive unique', () => {
	let engine: Engine<RègleModèleSocial>
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
				'salarié . cotisations . exonérations . RGDU',
				681.72
			)
		})

		it('Salaire supérieur à 3 Smic', () => {
			const Smic = engine.evaluate('SMIC').nodeValue as number
			const e = engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': `${Math.ceil(3 * Smic)} €/mois`,
			})

			expect(e).not.toBeApplicable(
				'salarié . cotisations . exonérations . RGDU'
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
				'salarié . cotisations . exonérations . RGDU'
			).nodeValue as number
		})

		it('Taille de l’entreprise', () => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'entreprise . salariés . effectif': '49',
			})
			const réductionÀ49 = engine.evaluate(
				'salarié . cotisations . exonérations . RGDU'
			).nodeValue as number

			expect(réductionDeBase).toEqual(réductionÀ49)

			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'entreprise . salariés . effectif': '50',
			})
			const réductionÀ50 = Math.round(
				engine.evaluate('salarié . cotisations . exonérations . RGDU')
					.nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionÀ50)
			expect(réductionÀ50).toEqual(689)
		})

		it('Obligation de cotiser à une caisse de congés payés', () => {
			engine.setSituation({
				...situationParDéfaut,
				'salarié . cotisations . assiette': '1900 €/mois',
				'salarié . cotisations . exonérations . RGDU . caisse de congés payés':
					'oui',
			})
			const réductionAvecCCP = Math.round(
				engine.evaluate('salarié . cotisations . exonérations . RGDU')
					.nodeValue as number
			)

			expect(réductionDeBase).toBeLessThan(réductionAvecCCP)
			expect(réductionAvecCCP).toEqual(
				Math.round((réductionDeBase * 100) / 90) - 1
			)
		})
	})
})
