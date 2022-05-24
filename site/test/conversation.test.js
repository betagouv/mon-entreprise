import rules from 'modele-social'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'
import {
	getNextQuestions,
	getNextSteps
} from '../source/components/utils/useNextQuestion'

describe('conversation', function () {
	it('should start with the first missing variable', function () {
		const missingVariables = new Engine({
			// TODO - this won't work without the indirection, figure out why
			top: 'oui',
			'top . startHere': { formule: { somme: ['a', 'b'] } },
			'top . a': { question: '?', titre: 'a', unité: '€' },
			'top . b': { question: '?', titre: 'b', unité: '€' },
		}).evaluate('top . startHere').missingVariables
		expect(getNextQuestions([missingVariables])[0]).to.equal('top . a')
	})
	it('should first ask for questions without defaults, then those with defaults', function () {
		const engine = new Engine({
			net: { formule: 'brut - cotisation' },
			brut: {
				question: 'Quel est le salaire brut ?',
				unité: '€/an',
			},
			cotisation: {
				formule: {
					produit: {
						assiette: 'brut',
						variations: [
							{
								si: 'cadre',
								alors: {
									taux: '77%',
								},
							},
							{
								sinon: {
									taux: '80%',
								},
							},
						],
					},
				},
			},
			cadre: {
				question: 'Est-ce un cadre ?',
				'par défaut': 'non',
			},
		})

		expect(
			getNextQuestions([engine.evaluate('net').missingVariables])[0]
		).to.equal('brut')

		engine.setSituation({
			brut: 2300,
		})

		expect(
			getNextQuestions([engine.evaluate('net').missingVariables])[0]
		).to.equal('cadre')
	})

	it('should ask "motif CDD" if "CDD" applies', function () {
		const result = Object.keys(
			new Engine(rules)
				.setSituation({
					'salarié': 'oui',
					'salarié . contrat . CDD': 'oui',
					'salarié . contrat . salaire brut': '2300',
				})
				.evaluate('salarié . rémunération . net').missingVariables
		)

		expect(result).to.include('salarié . contrat . CDD . motif')
	})
})

describe('getNextSteps', function () {
	it('should give priority to questions that advance most targets', function () {
		let missingVariablesByTarget = [
			{
				effectif: 34.01,
				cadre: 30,
			},
			{
				cadre: 10.1,
			},
			{
				effectif: 32.0,
				cadre: 10,
			},
		]

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('cadre')
	})

	it('should give priority to questions by total weight when advancing the same target count', function () {
		let missingVariablesByTarget = [
			{
				effectif: 24.01,
				cadre: 30,
			},
			{
				effectif: 24.01,
				cadre: 10.1,
			},
			{},
		]

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('effectif')
	})
})
