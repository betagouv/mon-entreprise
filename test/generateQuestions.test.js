import R from 'ramda'
import {expect} from 'chai'
import {rules, enrichRule} from '../source/engine/rules'
import {analyseSituation} from '../source/engine/traverse'
import {buildNextSteps, collectMissingVariables, getObjectives} from '../source/engine/generateQuestions'

let stateSelector = (state, name) => null

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
        console.log("situation",situation)

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

  it('should identify missing variables mentioned in expressions', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: [2, "deux"]}, espace: "sum"},
          {nom: "deux", formule: 2, "non applicable si" : "evt . nyet > evt . nope", espace: "sum"},
          {nom: "nope", espace: "sum . evt"},
          {nom: "nyet", espace: "sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"startHere")(stateSelector),
        result = collectMissingVariables()(situation)

    expect(result).to.have.property('sum . evt . nyet')
    expect(result).to.have.property('sum . evt . nope')
  });

});

describe('buildNextSteps', function() {

  it('should generate questions', function() {
    let rawRules = [
          {nom: "sum", formule: {somme: [2, "deux"]}, espace: "top"},
          {nom: "deux", formule: 2, "non applicable si" : "top . sum . evt . ko", espace: "top"},
          {nom: "evt", espace: "top . sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "top . sum . evt"}],
        rules = rawRules.map(enrichRule),
        situation = analyseSituation(rules,"sum")(stateSelector),
        result = buildNextSteps(rules, situation)

    expect(result).to.have.lengthOf(1)
    expect(R.path(["question","props","label"])(result[0])).to.equal("?")
  });

});
