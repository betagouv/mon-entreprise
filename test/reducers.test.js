import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyseSituation, analyseTopDown} from '../source/engine/traverse'
import {buildNextSteps, collectMissingVariables, getObjectives} from '../source/engine/generateQuestions'

import {reduceSteps} from '../source/reducers'

let stateSelector = state => name => null

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
        reducer = reduceSteps(rules, stateSelector),
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

});
