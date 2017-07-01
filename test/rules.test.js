import {expect} from 'chai'
import {enrichRule, collectMissingVariables, findVariantsAndRecords, getObjectives} from '../source/engine/rules'
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
          {nom: "startHere", formule: {somme: [2, "deux"]}, espace: "sum"},
          {nom: "deux", formule: 2, "non applicable si" : "sum . evt . ko", espace: "sum"},
          {nom: "evt", espace: "sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"startHere")(stateSelector),
        result = getObjectives(situation)

    expect(result).to.have.lengthOf(1)
    expect(result[0]).to.have.property('name','deux')
  });

  it('should identify missing variables', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: [2, "deux"]}, espace: "sum"},
          {nom: "deux", formule: 2, "non applicable si" : "sum . evt . ko", espace: "sum"},
          {nom: "evt", espace: "sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"startHere")(stateSelector),
        result = collectMissingVariables()(situation)

    expect(result).to.have.property('sum . evt . ko')
  });

});

describe('findVariantsAndRecords', function() {

  it('should classify rules as records by default', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: [3259, "dix"]}, espace: "top"},
          {nom: "dix", formule: "cinq", espace: "top"},
          {nom: "cinq", espace: "top", question:"?"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"startHere")(stateSelector),
        result = findVariantsAndRecords(rules, {variantGroups: {}, recordGroups: {}}, 'top . cinq', null)

      expect(result).to.have.deep.property('recordGroups', {top: ['top . cinq']})
  });

  it('should classify rules as variants if they are named in a "one of these" formula', function() {
    let rawRules = [
          {nom: "sum", formule: {somme: [2, "deux"]}, espace: "top"},
          {nom: "deux", formule: 2, "non applicable si" : "top . sum . evt . ko", espace: "top"},
          {nom: "evt", espace: "top . sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "top . sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"sum")(stateSelector),
        result = findVariantsAndRecords(rules, {variantGroups: {}, recordGroups: {}}, 'top . sum . evt . ko', 'top . deux')

      expect(result).to.have.deep.property('variantGroups', {"top . sum . evt": ['top . deux']})
  });

});
