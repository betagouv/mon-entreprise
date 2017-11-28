import R from 'ramda'
import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyse, parseAll} from '../source/engine/traverse'
import {reduceSteps} from '../source/reducers'

import {branches} from '../source/components/ResultsGrid.js'

let tracker = {push: array => null}

describe('results grid', function() {

  it('should collect branches', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rules = realRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({foldedSteps: []},{type:'START_CONVERSATION', targetNames: ['salaire net']})
	fakeState['contrat salarié . salaire de base'] = 2300
	var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'contrat salarié . salaire de base'})

	let analysis = step2.analysis,
		parsedRules = step2.parsedRules,
		result = branches(parsedRules,analysis)

	expect(result).to.have.lengthOf(4)
	expect(result).to.include("chômage")
	expect(result).to.include("maladie")
	expect(result).to.include("retraite")
	expect(result).to.include("autre")
  });

  it('should collect branches with both targets', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rules = realRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({foldedSteps: []},{type:'START_CONVERSATION', targetNames: ['salaire net', 'salaire total']})
	fakeState['contrat salarié . salaire de base'] = 2300
	var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'contrat salarié . salaire de base'})

	let analysis = step2.analysis,
		parsedRules = step2.parsedRules,
		result = branches(parsedRules,analysis)

	expect(result).to.have.lengthOf(6)
	expect(result).to.include("chômage")
	expect(result).to.include("maladie")
	expect(result).to.include("retraite")
	expect(result).to.include("logement")
	expect(result).to.include("famille")
	expect(result).to.include("autre")
  });

	// expect(cell("maladie","salarié",result)).to.be.closeTo(37, 2)

});
