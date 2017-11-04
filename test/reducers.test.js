import R from 'ramda'

import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyseSituation, analyseTopDown} from '../source/engine/traverse'
import {collectMissingVariables, getObjectives} from '../source/engine/generateQuestions'

import {reduceSteps} from '../source/reducers'

let stateSelector = state => name => null
let tracker = {push: array => null}

describe('fold', function() {

  it('should start conversation with only unfolded questions', function() {
    let rawRules = [
          // TODO - this won't work without the indirection, figure out why
          {nom: "startHere", formule: {somme: ["a","b"]}, espace: "top"},
          {nom: "a", espace: "top", formule: "aa"},
          {nom: "b", espace: "top", formule: "bb"},
          {nom: "aa", question: "?", titre: "a", espace: "top"},
          {nom: "bb", question: "?", titre: "b", espace: "top"}],
        rules = rawRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector),
        action = {type:'START_CONVERSATION', rootVariable: 'startHere'},
        // situation = analyseTopDown(rules,"startHere")(stateSelector({})),
        // objectives = getObjectives(stateSelector({}), situation.root, situation.parsedRules),
        // missing = collectMissingVariables()(stateSelector({}),situation),
        result = reducer({},action)

    expect(result).to.have.property('unfoldedSteps')
    expect(result.unfoldedSteps).to.have.lengthOf(2)
    expect(result.unfoldedSteps[0]).to.have.deep.property("name","top . aa")
    expect(result.unfoldedSteps[1]).to.have.deep.property("name","top . bb")
  });

  it('should deal with double unfold', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rawRules = [
          // TODO - this won't work without the indirection, figure out why
          {nom: "startHere", formule: {somme: ["a","b","c"]}, espace: "top"},
          {nom: "a", espace: "top", formule: "aa"},
          {nom: "b", espace: "top", formule: "bb"},
          {nom: "c", espace: "top", formule: "cc"},
          {nom: "aa", question: "?", titre: "a", espace: "top"},
          {nom: "bb", question: "?", titre: "b", espace: "top"},
          {nom: "cc", question: "?", titre: "c", espace: "top"}],
        rules = rawRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({},{type:'START_CONVERSATION', rootVariable: 'startHere'})
    fakeState['top . aa'] = 1
    var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'top . aa'})
    fakeState['top . bb'] = 1
    var step3 = reducer(step2,{type:'STEP_ACTION', name: 'fold', step: 'top . bb'})
    var step4 = reducer(step3,{type:'STEP_ACTION', name: 'unfold', step: 'top . aa'})
    var step5 = reducer(step4,{type:'STEP_ACTION', name: 'unfold', step: 'top . bb'})

    let result = step5

    expect(result).to.have.property('unfoldedSteps')
    expect(result.unfoldedSteps).to.have.lengthOf(2)
    expect(result.unfoldedSteps[0]).to.have.deep.property("name","top . bb")
    expect(result.unfoldedSteps[1]).to.have.deep.property("name","top . cc")
    expect(result).to.have.property('foldedSteps')
    expect(result.foldedSteps).to.have.lengthOf(1)
    expect(result.foldedSteps[0]).to.have.deep.property("name","top . aa")
  });

  it('should not list the same question in folded and unfolded', function() {
    let fakeState = {}
    let stateSelector = state => name => fakeState[name]

    let rawRules = [
          // TODO - this won't work without the indirection, figure out why
          {nom: "startHere", formule: {somme: ["a","b","c"]}, espace: "top"},
          {nom: "a", espace: "top", formule: "aa"},
          {nom: "b", espace: "top", formule: "bb"},
          {nom: "c", espace: "top", formule: "cc"},
          {nom: "aa", question: "?", titre: "a", espace: "top"},
          {nom: "bb", question: "?", titre: "b", espace: "top"},
          {nom: "cc", question: "?", titre: "c", espace: "top"}],
        rules = rawRules.map(enrichRule),
        reducer = reduceSteps(tracker, rules, stateSelector)

    var step1 = reducer({},{type:'START_CONVERSATION', rootVariable: 'startHere'})
    fakeState['top . aa'] = 1
    var step2 = reducer(step1,{type:'STEP_ACTION', name: 'fold', step: 'top . aa'})
    fakeState['top . bb'] = 1
    var step3 = reducer(step2,{type:'STEP_ACTION', name: 'fold', step: 'top . bb'})
    var step4 = reducer(step3,{type:'STEP_ACTION', name: 'unfold', step: 'top . aa'})
    var step5 = reducer(step4,{type:'STEP_ACTION', name: 'unfold', step: 'top . bb'})
    var step6 = reducer(step5,{type:'STEP_ACTION', name: 'fold', step: 'top . bb'})

    let result = step6

    expect(result).to.have.property('unfoldedSteps')
    expect(result.unfoldedSteps).to.have.lengthOf(1)
    expect(result.unfoldedSteps[0]).to.have.deep.property("name","top . cc")
    expect(result).to.have.property('foldedSteps')
    expect(result.foldedSteps).to.have.lengthOf(2)
    expect(result.foldedSteps[0]).to.have.deep.property("name","top . aa")
    expect(result.foldedSteps[1]).to.have.deep.property("name","top . bb")
  });

});
