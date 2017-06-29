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

  /* TODO: make this pass
  it('should directly return simple numerical values', function() {
    let rule = {formule: "3269"}
    expect(treatRuleRoot(stateSelector,[rule],rule)).to.have.property('nodeValue',3269)
  });
  */

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

describe('analyseSituation with mecanisms', function() {

  it('should handle n-way "or"', function() {
    let rawRules = [
          {nom: "startHere", formule: {"une de ces conditions": ["1 > 2", "1 > 0", "0 > 2"]}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',true)
  });

  it('should handle n-way "and"', function() {
    let rawRules = [
          {nom: "startHere", formule: {"toutes ces conditions": ["1 > 2", "1 > 0", "0 > 2"]}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',false)
  });

  it('should handle switch statements', function() {
    let rawRules = [
          {nom: "startHere", formule: {"logique numérique": {
                  "1 > dix":"10",
                  "3 < dix":"11",
                  "3 > dix":"12"
              }}, espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',11)
  });

  it('should handle percentages', function() {
    let rawRules = [
          {nom: "startHere", formule: {taux: "35%"}, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',0.35)
  });

  it('should handle sums', function() {
    let rawRules = [
          {nom: "startHere", formule: {"somme": [3200, 60, 9]}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3269)
  });

  it('should handle multiplications', function() {
    let rawRules = [
          {nom: "startHere", formule: {"multiplication": {assiette:3259, plafond:3200, facteur:1, taux:1.5}}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',4800)
  });

  it('should handle components in multiplication', function() {
    let rawRules = [
          {nom: "startHere", formule: {"multiplication": {assiette:3200,
            composantes: [{taux:0.7}, {taux:0.8}]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',4800)
  });

  it('should apply a ceiling to the sum of components', function() {
    let rawRules = [
          {nom: "startHere", formule: {"multiplication": {assiette:3259, plafond:3200,
            composantes: [{taux:0.7}, {taux:0.8}]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',4800)
  });

  it('should handle progressive scales', function() {
    let rawRules = [
          {nom: "startHere", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: 1.2}, ,{"au-dessus de":2, taux: 10}]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',100+1200+80)
  });

  it('should handle progressive scales with components', function() {
    let rawRules = [
          {nom: "startHere", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            composantes: [
              {"tranches":[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.4}, ,{"au-dessus de":2, taux: 5}]},
              {"tranches":[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.8}, ,{"au-dessus de":2, taux: 5}]}
            ]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',100+1200+80)
  });

  it('should handle max', function() {
    let rawRules = [
          {nom: "startHere", formule: {"le maximum de": [3200, 60, 9]}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3200)
  });

});
