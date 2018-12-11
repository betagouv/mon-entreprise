import { expect } from 'chai'
import dedent from 'dedent-js'
import { enrichRule } from 'Engine/rules'
import { safeLoad } from 'js-yaml'
import { assocPath, merge } from 'ramda'
import reducers from 'Reducers/rootReducer'
import { rulesFr as rules } from 'Règles'
import { simulationTargetNames } from '../source/config'
import {
	currentQuestionSelector,
	nextStepsSelector
} from '../source/selectors/analyseSelectors'

let baseState = {
	conversationSteps: { foldedSteps: [] },
	form: { conversation: { values: {} } }
}

describe('conversation', function() {
	it('should start with the first missing variable', function() {
		let rawRules = [
				// TODO - this won't work without the indirection, figure out why
				{ nom: 'startHere', formule: { somme: ['a', 'b'] }, espace: 'top' },
				{ nom: 'a', espace: 'top', formule: 'aa' },
				{ nom: 'b', espace: 'top', formule: 'bb' },
				{ nom: 'aa', question: '?', titre: 'a', espace: 'top' },
				{ nom: 'bb', question: '?', titre: 'b', espace: 'top' }
			],
			rules = rawRules.map(enrichRule),
			state = merge(baseState, {
				targetNames: ['startHere']
			}),
			currentQuestion = currentQuestionSelector(state, { rules })

		expect(currentQuestion).to.equal('top . aa')
	})
	it('should deal with double unfold', function() {
		let rawRules = [
				// TODO - this won't work without the indirection, figure out why
				{
					nom: 'startHere',
					formule: { somme: ['a', 'b', 'c'] },
					espace: 'top'
				},
				{ nom: 'a', espace: 'top', formule: 'aa' },
				{ nom: 'b', espace: 'top', formule: 'bb' },
				{ nom: 'c', espace: 'top', formule: 'cc' },
				{ nom: 'aa', question: '?', titre: 'a', espace: 'top' },
				{ nom: 'bb', question: '?', titre: 'b', espace: 'top' },
				{ nom: 'cc', question: '?', titre: 'c', espace: 'top' }
			],
			rules = rawRules.map(enrichRule)

		let step1 = merge(baseState, {
			targetNames: ['startHere']
		})
		let step2 = reducers(
			assocPath(
				['form', 'conversation', 'values'],
				{ top: { aa: '1' } },
				step1
			),
			{
				type: 'STEP_ACTION',
				name: 'fold',
				step: 'top . aa'
			}
		)

		let step3 = reducers(
			assocPath(
				['form', 'conversation', 'values'],
				{ top: { bb: '1', aa: '1' } },
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

		expect(currentQuestionSelector(lastStep, { rules })).to.equal('top . bb')
		expect(lastStep.conversationSteps).to.have.property('foldedSteps')
		expect(lastStep.conversationSteps.foldedSteps).to.have.lengthOf(1)
		expect(lastStep.conversationSteps.foldedSteps[0]).to.equal('top . aa')
	})

	it('should first ask for questions without defaults, then those with defaults', function() {
		let rawRules = dedent`
        - nom: net
          formule: brut - cotisation

        - nom: brut
          format: euro

        - nom: cotisation
          formule:
            multiplication:
              assiette: brut
              variations:
                - si: cadre
                  alors: 
                    taux: 77%
                - sinon:
                    taux: 80%
        - nom: cadre
      `,
			rules = safeLoad(rawRules).map(enrichRule)

		let step1 = merge(baseState, {
			targetNames: ['net']
		})

		expect(currentQuestionSelector(step1, { rules })).to.equal('brut')

		// let step2 = reducers(
		// 	assocPath(['form', 'conversation', 'values', 'brut'], '2300', step1),
		// 	{
		// 		type: 'STEP_ACTION',
		// 		name: 'fold',
		// 		step: 'brut'
		// 	}
		// )

		// expect(step2.conversationSteps).to.have.property('foldedSteps')
		// expect(step2.conversationSteps.foldedSteps).to.have.lengthOf(1)
		// expect(step2.conversationSteps.foldedSteps[0]).to.equal('brut')
		// expect(currentQuestionSelector(step2, { rules })).to.equal('cadre')
	})
})
describe('real conversation', function() {
	it('should not have more than X questions', function() {
		let state = merge(baseState, {
				targetNames: simulationTargetNames
			}),
			nextSteps = nextStepsSelector(state, { rules })

		expect(nextSteps.length).to.be.below(30) // If this breaks, that's good news
		expect(nextSteps.length).to.be.above(10)
	})
})
