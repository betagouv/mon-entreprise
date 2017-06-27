import {expect} from 'chai'
import {enrichRule} from '../source/engine/rules'
import {treatRuleRoot} from '../source/engine/traverse'
import {analyseSituation} from '../source/engine/traverse'

let stateSelector = (state, name) => null

describe('treatRuleRoot', function() {

  it('should directly return simple numerical values', function() {
    let rule = {formule: 3269}
    expect(treatRuleRoot(stateSelector,[rule],rule)).to.have.property('nodeValue',3269)
  });

});

describe('analyseSituation', function() {

  it('should directly return simple numerical values', function() {
    let rule = {name: "startHere", formule: 3269}
    let rules = [rule]
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3269)
  });

  it('should compute expressions combining constants', function() {
    let rule = {name: "startHere", formule: "32 + 69"}
    let rules = [rule]
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',101)
  });

});

describe('analyseSituation on raw rules', function() {

  it('should handle expressions referencing other rules', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3269)
  });

  it('should handle applicability conditions', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top", "non applicable si" : "vrai"},
          {nom: "vrai", formule: "2 > 1", espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3259)
  });

  /* TODO: make this pass
  it('should handle applicability conditions', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top", "non applicable si" : "vrai"},
          {nom: "vrai", formule: "1", espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3259)
  });
  */

});
