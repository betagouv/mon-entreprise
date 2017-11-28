import R from 'ramda'
import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyse, parseAll} from '../source/engine/traverse'
import {reduceSteps} from '../source/reducers'

import {byBranch, byName, cell} from '../source/components/ResultsGrid.js'

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
		result = byBranch(analysis),
		branches = R.keys(result)

	expect(branches).to.have.lengthOf(4)
	expect(branches).to.include("chômage")
	expect(branches).to.include("maladie")
	expect(branches).to.include("retraite")
	expect(branches).to.include("autre")
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
		result = byBranch(analysis),
		branches = R.keys(result)

	expect(branches).to.have.lengthOf(6)
	expect(branches).to.include("chômage")
	expect(branches).to.include("maladie")
	expect(branches).to.include("retraite")
	expect(branches).to.include("logement")
	expect(branches).to.include("famille")
	expect(branches).to.include("autre")
  });

  it('should collect cells by name', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rules = realRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({foldedSteps: []},{type:'START_CONVERSATION', targetNames: ['salaire net', 'salaire total']})
	fakeState['contrat salarié . salaire de base'] = 2300
	var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'contrat salarié . salaire de base'})

	let analysis = step2.analysis,
		result = byBranch(analysis),
		maladie = byName(result.maladie),
		names = R.keys(maladie)

	expect(names).to.have.lengthOf(3)
	expect(names).to.include("contrat salarié . maladie")
	expect(names).to.include("contrat salarié . ATMP")
	expect(names).to.include("contrat salarié . cotisation pénibilité")
  });

  it('should sum cells by branch and payer', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rules = realRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({foldedSteps: []},{type:'START_CONVERSATION', targetNames: ['salaire net', 'salaire total']})
	fakeState['contrat salarié . salaire de base'] = 2300
	var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'contrat salarié . salaire de base'})

	let analysis = step2.analysis

	expect(cell("retraite","salarié",analysis)).to.be.closeTo(257, 5)
	expect(cell("autre","salarié",analysis)).to.be.closeTo(200, 5)
  });

});
