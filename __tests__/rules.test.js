import {expect} from 'chai'
import {enrichRule, collectMissingVariables, getObjectives} from '../source/engine/rules'
import {analyseSituation} from '../source/engine/traverse'

let stateSelector = (state, name) => null

describe('enrichRule', function() {

  it('should extract the type of the rule', function() {
    let rule = {cotisation:{}}
    expect(enrichRule(rule)).to.have.property('type','cotisation')
  });

  it('should extract the dotted name of the rule', function() {
    let rule = {espace:"contrat salarié", nom: "CDD"}
    expect(enrichRule(rule)).to.have.property('name','CDD')
    expect(enrichRule(rule)).to.have.property('dottedName','contrat salarié . CDD')
  });

  it('should render Markdown in sub-questions', function() {
    let rule = {"sous-question":"**wut**"}
    expect(enrichRule(rule)).to.have.property('subquestion','<p><strong>wut</strong></p>\n')
  });
});

describe('collectMissingVariables', function() {

  it('should derive objectives from the root rule', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: [3259, "dix"]}, espace: "top"},
          {nom: "dix", formule: "cinq", espace: "top"},
          {nom: "cinq", espace: "top"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"startHere")(stateSelector),
        result = getObjectives(situation)

    expect(result).to.have.lengthOf(1)
    expect(result[0]).to.have.property('name','dix')
  });

});
