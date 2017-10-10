import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyseSituation, analyseTopDown} from '../source/engine/traverse'

let stateSelector = (state, name) => null

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

  it('should compute expressions combining constants', function() {
    let rule = {name: "startHere", formule: "100 - 71"}
    let rules = [rule]
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue', 29)
  });

});

describe('analyseSituation on raw rules', function() {

  it('should handle direct referencing of a variable', function() {
    let rawRules = [
          {nom: "startHere", formule: "dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',10)
  });

  it('should handle expressions referencing other rules', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3269)
  });

  it('should handle complex variable sum expressions', function() {
    let rawRules = [
          {nom: "startHere", formule: "+ A + B - C", espace: "top"},
          {nom: "A", formule: 15, espace: "top"},
          {nom: "B", formule: 15, espace: "top"},
          {nom: "C", formule: 1, espace: "top"}
        ],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',29)
  });

  it('should handle applicability conditions', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top", "non applicable si" : "vrai"},
          {nom: "vrai", formule: "2 > 1", espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3259)
  });

  it('should handle comparisons', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 > dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',true)
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
          {nom: "startHere", formule: {"aiguillage numérique": {
                  "1 > dix":"1000%",
                  "3 < dix":"1100%",
                  "3 > dix":"1200%"
              }}, espace: "top"},
          {nom: "dix", formule: 10, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',11)
  });

  it('should handle percentages', function() {
    let rawRules = [
          {nom: "startHere", formule: "35%", espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',0.35)
  });

  it('should handle sums', function() {
    let rawRules = [
          {nom: "startHere", formule: {"somme": [3200, "dix", 9]}},
          {nom: "dix", formule: 10}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3219)
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

  it('should handle progressive scales with variations', function() {
    let rawRules = [
          {nom: "startHere", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            "variations":[
              {si: "3 > 4", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: 1.2}, ,{"au-dessus de":2, taux: 10}]},
              {si: "3 > 2", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: 1.8}, ,{"au-dessus de":2, taux: 10}]},
            ]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',100+1800+80)
  });

  it('should handle max', function() {
    let rawRules = [
          {nom: "startHere", formule: {"le maximum de": [3200, 60, 9]}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3200)
  });

  it('should handle complements', function() {
    let rawRules = [
          {nom: "startHere", formule: {complément: {cible: "dix", montant: 93}}, espace: "top"},
          {nom: "dix", formule: 17, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',93-17)
  });

  it('should handle components in complements', function() {
    let rawRules = [
          {nom: "startHere", formule: {complément: {cible: "dix",
            composantes: [{montant: 93},{montant: 93}]
          }}, espace: "top"},
          {nom: "dix", formule: 17, espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',2*(93-17))
  });

  it('should handle filtering on components', function() {
    let rawRules = [
          {nom: "startHere", espace: "top", formule: "composed (salarié)"},
          {nom: "composed", espace: "top", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            composantes: [
              {tranches:[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.4}, ,{"au-dessus de":2, taux: 5}],
               attributs: {"dû par":"salarié"}
              },
              {tranches:[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.8}, ,{"au-dessus de":2, taux: 5}],
               attributs: {"dû par":"employeur"}
              }
            ]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',50+400+40)
  });

  it('should compute consistent values', function() {
    let rawRules = [
          {nom: "startHere", espace: "top", formule: "composed (salarié) + composed (employeur)"},
          {nom: "orHere", espace: "top", formule: "composed"},
          {nom: "composed", espace: "top", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            composantes: [
              {tranches:[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.4}, ,{"au-dessus de":2, taux: 5}],
               attributs: {"dû par":"salarié"}
              },
              {tranches:[{"en-dessous de":1, taux: 0.05},{de:1, "à": 2, taux: 0.8}, ,{"au-dessus de":2, taux: 5}],
               attributs: {"dû par":"employeur"}
              }
            ]
          }}}],
        rules = rawRules.map(enrichRule)
    expect(analyseSituation(rules,"orHere")(stateSelector)).to.have.property('nodeValue',100+1200+80)
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',100+1200+80)
  });

  it('should handle selection', function() {
    let stateSelector = (name) => ({"top . code postal":"2"})[name]
    let data = {taux_versement_transport: [{codePostal:1, aot: {taux: {"2019":"1.0"}}}, {codePostal:2, smt: {taux: {"2019":"2.0"}}}]}
    let rawRules = [
          { espace: "top",
            nom: "startHere",
            formule: {"sélection": {
              données: "startHere",
              cherche: "code postal",
              dans: "codePostal",
              renvoie: "smt"
            }},
            données: 'taux_versement_transport'},
          {espace: "top", nom: "code postal", format: "nombre"}],
        rules = rawRules.map(rule => enrichRule(rule,data))
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',0.02)
  });

  it('should handle failed selections', function() {
    let stateSelector = (name) => ({"top . code postal":"3"})[name]
    let data = {taux_versement_transport: [{codePostal:1, aot: {taux: {"2019":"1.0"}}}, {codePostal:2, smt: {taux: {"2019":"2.0"}}}]}
    let rawRules = [
          { espace: "top",
            nom: "startHere",
            formule: {"sélection": {
              données: "startHere",
              cherche: "code postal",
              dans: "codePostal",
              renvoie: "smt"
            }},
            données: 'taux_versement_transport'},
          {espace: "top", nom: "code postal", format: "nombre"}],
        rules = rawRules.map(rule => enrichRule(rule,data))
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue', 0)
  });

});
