import R from 'ramda'
import {expect} from 'chai'
import {rules, enrichRule} from '../source/engine/rules'
import {analyseSituation} from '../source/engine/traverse'
import {buildNextSteps} from '../source/engine/generateQuestions'

let stateSelector = (state, name) => null

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

  it('should generate questions from the real rule set', function() {
    let situation = analyseSituation(rules,"surcoût CDD")(stateSelector),
        result = buildNextSteps(rules, situation)
  });

});
