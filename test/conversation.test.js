import { expect } from 'chai'
import { enrichRule, rulesFr as rules } from 'Engine/rules'
import { assocPath, merge } from 'ramda'
import reducers from 'Reducers/rootReducer'
import salariéConfig from '../source/components/simulationConfigs/salarié.yaml'
import {
	currentQuestionSelector,
	nextStepsSelector
} from '../source/selectors/analyseSelectors'
let baseState = {
	simulation: { situation: {}, foldedSteps: [] }
}

describe('conversation', function() {
	it('should start with the first missing variable', function() {
		let rawRules = [
				// TODO - this won't work without the indirection, figure out why
				{ nom: 'top . startHere', formule: { somme: ['a', 'b'] } },
				{ nom: 'top . a', formule: 'aa' },
				{ nom: 'top . b', formule: 'bb' },
				{ nom: 'top . aa', question: '?', titre: 'a', unité: '€' },
				{ nom: 'top . bb', question: '?', titre: 'b', unité: '€' }
			],
			rules = rawRules.map(enrichRule),
			state = merge(baseState, {
				rules,
				simulation: { config: { objectifs: ['startHere'] }, foldedSteps: [] }
			}),
			currentQuestion = currentQuestionSelector(state)

		expect(currentQuestion).to.equal('top . aa')
	})
	it('should deal with double unfold', function() {
		let rawRules = [
				// TODO - this won't work without the indirection, figure out why
				{
					nom: 'top . startHere',
					formule: { somme: ['a', 'b', 'c'] }
				},
				{ nom: 'top . a', formule: 'aa' },
				{ nom: 'top . b', formule: 'bb' },
				{ nom: 'top . c', formule: 'cc' },
				{ nom: 'top . aa', question: '?', titre: 'a', unité: '€' },
				{ nom: 'top . bb', question: '?', titre: 'b', unité: '€' },
				{ nom: 'top . cc', question: '?', titre: 'c', unité: '€' }
			],
			rules = rawRules.map(enrichRule)

		let step1 = merge(baseState, {
			rules,
			simulation: { config: { objectifs: ['startHere'] }, foldedSteps: [] }
		})
		let step2 = reducers(
			assocPath(['simulation', 'situation'], { 'top . aa': '1' }, step1),
			{
				type: 'STEP_ACTION',
				name: 'fold',
				step: 'top . aa'
			}
		)

		let step3 = reducers(
			assocPath(
				['simulation', 'situation'],
				{ 'top . aa': '1', 'top . bb': '1' },
				step2
			),
			{
				type: 'STEP_ACTION',
				name: 'fold',
				step: 'top . bb'
			}
		)
		let step4 = reducers(step3, {
			type: 'STEP_ACTION',
			name: 'unfold',
			step: 'top . aa'
		})
		let lastStep = reducers(step4, {
			type: 'STEP_ACTION',
			name: 'unfold',
			step: 'top . bb'
		})

		expect(currentQuestionSelector(lastStep)).to.equal('top . bb')
		expect(lastStep.simulation).to.have.property('foldedSteps')
		expect(lastStep.simulation.foldedSteps).to.have.lengthOf(0)
	})

	it('should first ask for questions without defaults, then those with defaults', function() {
		let rawRules = [
				{ nom: 'net', formule: 'brut - cotisation' },
				{
					nom: 'brut',
					question: 'Quel est le salaire brut ?'
				},
				{
					nom: 'cotisation',
					formule: {
						produit: {
							assiette: 'brut',
							variations: [
								{
									si: 'cadre',
									alors: {
										taux: '77%'
									}
								},
								{
									sinon: {
										taux: '80%'
									}
								}
							]
						}
					}
				},
				{
					nom: 'cadre',
					question: 'Est-ce un cadre ?',
					'par défaut': 'non'
				}
			],
			rules = rawRules.map(enrichRule)

		let step1 = merge(baseState, {
			rules,
			simulation: { config: { objectifs: ['net'] }, foldedSteps: [] }
		})
		expect(currentQuestionSelector(step1)).to.equal('brut')

		let step2 = reducers(
			assocPath(['simulation', 'situation', 'brut'], '2300', step1),
			{
				type: 'STEP_ACTION',
				name: 'fold',
				step: 'brut'
			}
		)

		expect(step2.simulation).to.have.property('foldedSteps')
		expect(step2.simulation.foldedSteps).to.have.lengthOf(1)
		expect(step2.simulation.foldedSteps[0]).to.equal('brut')
		expect(currentQuestionSelector(step2)).to.equal('cadre')
	})
})
describe('real conversation', function() {
	it('should not have more than X questions', function() {
		let state = merge(baseState, {
				rules,
				simulation: { config: salariéConfig, foldedSteps: [] }
			}),
			nextSteps = nextStepsSelector(state)

		expect(nextSteps.length).to.be.below(30) // If this breaks, that's good news
		expect(nextSteps.length).to.be.above(10)
	})
})
