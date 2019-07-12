import { expect } from 'chai'
import dedent from 'dedent-js'
import { safeLoad } from 'js-yaml'
import { enrichRule } from '../source/engine/rules'
import reduceSteps from '../source/reducers/reduceSteps'

let stateSelector = () => () => null

describe('fold', function() {
	it('should start conversation with the first missing variable', function() {
		let rawRules = [
				// TODO - this won't work without the indirection, figure out why
				{ nom: 'startHere', formule: { somme: ['a', 'b'] }, espace: 'top' },
				{ nom: 'a', espace: 'top', formule: 'aa' },
				{ nom: 'b', espace: 'top', formule: 'bb' },
				{ nom: 'aa', question: '?', titre: 'a', espace: 'top' },
				{ nom: 'bb', question: '?', titre: 'b', espace: 'top' }
			],
			rules = rawRules.map(enrichRule),
			reducer = reduceSteps(rules, stateSelector),
			action = { type: 'START_CONVERSATION' },
			// situation = analyseTopDown(rules,"startHere")(stateSelector({})),
			// objectives = getObjectives(stateSelector({}), situation.root, situation.parsedRules),
			// missing = collectMissingVariables(stateSelector({}),situation),
			result = reducer({ foldedSteps: [], targetNames: ['startHere'] }, action)

		expect(result).to.have.property('currentQuestion')
		expect(result.currentQuestion).to.equal('top . aa')
	})

	it('should deal with double unfold', function() {
		let fakeState = {}
		let stateSelector = () => name => fakeState[name]

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
			rules = rawRules.map(enrichRule),
			reducer = reduceSteps(rules, stateSelector)

		var step1 = reducer(
			{ foldedSteps: [], targetNames: ['startHere'] },
			{ type: 'START_CONVERSATION' }
		)
		fakeState['top . aa'] = 1
		var step2 = reducer(step1, {
			type: 'STEP_ACTION',
			name: 'fold',
			step: 'top . aa'
		})
		fakeState['top . bb'] = 1
		var step3 = reducer(step2, {
			type: 'STEP_ACTION',
			name: 'fold',
			step: 'top . bb'
		})
		var step4 = reducer(step3, {
			type: 'STEP_ACTION',
			name: 'unfold',
			step: 'top . aa'
		})
		var step5 = reducer(step4, {
			type: 'STEP_ACTION',
			name: 'unfold',
			step: 'top . bb'
		})

		let result = step5

		expect(result).to.have.property('currentQuestion')
		expect(result.currentQuestion).to.equal('top . bb')
		expect(result).to.have.property('foldedSteps')
		expect(result.foldedSteps).to.have.lengthOf(1)
		expect(result.foldedSteps[0]).to.equal('top . aa')
	})

	it('should first ask for questions without defaults, then those with defaults', function() {
		let fakeState = {}
		let stateSelector = () => name => fakeState[name]
		let rawRules = dedent`
        - nom: net
          formule: brut - cotisation

        - nom: brut
          unité: €

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
          par défaut: non
      `,
			rules = safeLoad(rawRules).map(enrichRule),
			reducer = reduceSteps(rules, stateSelector)

		var step1 = reducer(
			{ foldedSteps: [], targetNames: ['net'] },
			{ type: 'START_CONVERSATION' }
		)

		expect(step1).to.have.property('currentQuestion')
		expect(step1.currentQuestion).to.equal('brut')

		fakeState['brut'] = 2300
		var step2 = reducer(step1, {
			type: 'STEP_ACTION',
			name: 'fold',
			step: 'brut'
		})

		expect(step2).to.have.property('foldedSteps')
		expect(step2.foldedSteps).to.have.lengthOf(1)
		expect(step2.foldedSteps[0]).to.equal('brut')
		expect(step2).to.have.property('currentQuestion')
		expect(step2.currentQuestion).to.equal('cadre')
	})
})
