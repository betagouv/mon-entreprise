import R from 'ramda'
import {expect} from 'chai'
import {rules, enrichRule, findVariantsAndRecords} from '../source/engine/rules'
import {analyseSituation, analyseTopDown} from '../source/engine/traverse'

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

describe('findVariantsAndRecords', function() {

  it('should classify rules as records by default', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: [3259, "dix"]}, espace: "top"},
          {nom: "dix", formule: "cinq", espace: "top"},
          {nom: "cinq", espace: "top", question:"?"}],
        rules = rawRules.map(enrichRule),
        situation = analyseTopDown(rules,"startHere")(stateSelector),
        result = findVariantsAndRecords(rules, ['top . cinq'])

      expect(result).to.have.deep.property('recordGroups', {top: ['top . cinq']})
  });

  it('should classify rules as variants if they are named in a "one of these" formula', function() {
    let rawRules = [
          {nom: "sum", formule: {somme: [2, "deux"]}, espace: "top"},
          {nom: "deux", formule: 2, "non applicable si" : "top . sum . evt . ko", espace: "top"},
          {nom: "evt", espace: "top . sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "top . sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseTopDown(rules,"sum")(stateSelector),
        result = findVariantsAndRecords(rules, ['top . sum . evt . ko'])

      expect(result).to.have.deep.property('variantGroups', {"top . sum . evt": ['top . sum . evt . ko']})
  });

});
