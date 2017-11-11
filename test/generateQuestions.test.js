import R from 'ramda'
import {expect} from 'chai'
import {rules as realRules, enrichRule} from '../source/engine/rules'
import {analyse} from '../source/engine/traverse'
import {nextSteps, collectMissingVariables} from '../source/engine/generateQuestions'


let stateSelector = (name) => null


describe('collectMissingVariables', function() {

  it('should identify missing variables', function() {
    let rawRules = [
          {nom: "startHere", formule: 2, "non applicable si" : "sum . evt . ko", espace: "sum"},
          {nom: "evt", espace: "sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "sum . evt"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)
    expect(result).to.have.property('sum . evt . ko')
  });

  it('should identify missing variables mentioned in expressions', function() {
    let rawRules = [
          {nom: "startHere", formule: 2, "non applicable si" : "evt . nyet > evt . nope", espace: "sum"},
          {nom: "nope", espace: "sum . evt"},
          {nom: "nyet", espace: "sum . evt"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.have.property('sum . evt . nyet')
    expect(result).to.have.property('sum . evt . nope')
  });

  it('should ignore missing variables in the formula if not applicable', function() {
    let rawRules = [
          {nom: "startHere", formule: "trois", "non applicable si" : "3 > 2", espace: "sum"},
          {nom: "trois", espace: "sum"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should not report missing variables when "one of these" short-circuits', function() {
    let rawRules = [
          {nom: "startHere", formule: "trois", "non applicable si" : {"une de ces conditions": ["3 > 2", "trois"]}, espace: "sum"},
          {nom: "trois", espace: "sum"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should report "une possibilité" as a missing variable even though it has a formula', function() {
    let rawRules = [
          {nom: "startHere", formule: "trois", espace: "top"},
          {nom: "trois", formule: {"une possibilité":["ko"]}, espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.have.property('top . trois')
  });

  it('should not report missing variables when "une possibilité" is inapplicable', function() {
    let rawRules = [
          {nom: "startHere", formule: "trois", espace: "top"},
          {nom: "trois", formule: {"une possibilité":["ko"]}, "non applicable si": 1, espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should not report missing variables when "une possibilité" was answered', function() {
    let mySelector = (name) => ({"top . trois":"ko"})[name]

    let rawRules = [
          {nom: "startHere", formule: "trois", espace: "top"},
          {nom: "trois", formule: {"une possibilité":["ko"]}, espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(mySelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should report missing variables in switch statements', function() {
    let rawRules = [
          { nom: "startHere", formule: {"aiguillage numérique": {
                  "11 > dix":"1000%",
                  "3 > dix":"1100%",
                  "1 > dix":"1200%"
              }}, espace: "top"},
          {nom: "dix", espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.have.property('top . dix')
  });

  it('should report missing variables in variations', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: ["variations"]}, espace: "top"},
          {nom: "variations", espace: "top", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            "variations":[
              {si: "dix", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: "deux"}, ,{"au-dessus de":2, taux: 10}]},
              {si: "3 > 4", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: 1.8}, ,{"au-dessus de":2, taux: 10}]},
            ]
          }}},
          {nom: "dix", espace: "top"},
          {nom: "deux", espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.have.property('top . dix')
    // expect(result).to.have.property('top . deux') - this is a TODO
  });

  it('should not report missing variables in irrelevant variations', function() {
    let rawRules = [
          {nom: "startHere", formule: {somme: ["variations"]}, espace: "top"},
          {nom: "variations", espace: "top", formule: {"barème": {
            assiette:2008,
            "multiplicateur des tranches":1000,
            "variations":[
              {si: "dix", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: "deux"}, ,{"au-dessus de":2, taux: 10}]},
              {si: "3 > 2", "tranches":[{"en-dessous de":1, taux: 0.1},{de:1, "à": 2, taux: 1.8}, ,{"au-dessus de":2, taux: 10}]},
            ]
          }}},
          {nom: "dix", espace: "top"},
          {nom: "deux", espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should not report missing variables in switch for consequences of false conditions', function() {
    let rawRules = [
          { nom: "startHere", formule: {"aiguillage numérique": {
                  "8 > 10":"1000%",
                  "1 > 2":"dix"
              }}, espace: "top"},
          {nom: "dix", espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

  it('should report missing variables in consequence when its condition is unresolved', function() {
  let rawRules = [
    { nom: "startHere",
      formule: {
        "aiguillage numérique": {
          "10 > 11": "1000%",
          "3 > dix": {
            "douze": "560%",
            "1 > 2": "75015%" }
        }
      },
      espace: "top"
    },
    { nom: "douze", espace: "top" },
    { nom: "dix", espace: "top" }
  ],
  rules = rawRules.map(enrichRule),
  analysis = analyse(rules, "startHere")(stateSelector),
  result = collectMissingVariables(analysis.targets)


  expect(result).to.have.property('top . dix')
  expect(result).to.have.property('top . douze')
  });

  it('should not report missing variables when a switch short-circuits', function() {
    let rawRules = [
          { nom: "startHere", formule: {"aiguillage numérique": {
                  "11 > 10":"1000%",
                  "3 > dix":"1100%",
                  "1 > dix":"1200%"
              }}, espace: "top"},
          {nom: "dix", espace: "top"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"startHere")(stateSelector),
        result = collectMissingVariables(analysis.targets)

    expect(result).to.deep.equal({})
  });

});

describe('nextSteps', function() {

  it('should generate questions', function() {
    let rawRules = [
          {nom: "sum", formule: {somme: [2, "deux"]}, espace: "top"},
          {nom: "deux", formule: 2, "non applicable si" : "top . sum . evt = 'ko'", espace: "top"},
          {nom: "evt", espace: "top . sum", formule: {"une possibilité":["ko"]}, titre: "Truc", question:"?"},
          {nom: "ko", espace: "top . sum . evt"}],
        rules = rawRules.map(enrichRule),
        analysis = analyse(rules,"sum")(stateSelector),
        result = nextSteps(stateSelector, rules, analysis)

    expect(result).to.have.lengthOf(1)
    expect(result[0]).to.equal("top . sum . evt")
  });

  it('should generate questions from the real rules', function() {
    let rules = realRules.map(enrichRule),
        analysis = analyse(rules,"surcoût CDD")(stateSelector),
        missing = collectMissingVariables(analysis.targets),
        result = nextSteps(stateSelector, rules, analysis)

    // expect(objectives).to.have.lengthOf(4)

    // expect(missing).to.have.property('contrat salarié . type de contrat')
    // expect(missing).to.have.property('contrat salarié . CDD . événement')
    // expect(missing).to.have.property('contrat salarié . CDD . motif')
    // expect(missing).to.have.property('contrat salarié . salaire de base')
    // expect(missing).to.have.property('contrat salarié . CDD . contrat jeune vacances')
    // expect(missing).to.have.property('contrat salarié . CDD . durée contrat')
    // expect(missing).to.have.property('contrat salarié . CDD . congés non pris')

    // One question per missing variable !
    // expect(R.keys(missing)).to.have.lengthOf(7)
    // expect(result).to.have.lengthOf(7)

    // expect(R.path(["question","props","label"])(result[0])).to.equal("Quelle est la nature du contrat de travail ?")
    // expect(R.path(["question","props","label"])(result[1])).to.equal("Pensez-vous être confronté à l'un de ces événements au cours du contrat ?")
    // expect(R.path(["question","props","label"])(result[2])).to.equal("Quel est le motif de recours au CDD ?")
    // expect(R.path(["question","props","label"])(result[3])).to.equal("Quel est le salaire brut ?")
    // expect(R.path(["question","props","label"])(result[4])).to.equal("Est-ce un contrat jeune vacances ?")
    // expect(R.path(["question","props","label"])(result[5])).to.equal("Quelle est la durée du contrat ?")
    // expect(R.path(["question","props","label"])(result[6])).to.equal("Combien de jours de congés ne seront pas pris ?")
  });

  it('should generate questions from the real rules, experimental version', function() {
    let stateSelector = (name) => ({"contrat salarié . type de contrat":"CDI","entreprise . effectif":"50"})[name]

    let rules = realRules.map(enrichRule),
        analysis = analyse(rules,"Salaire")(stateSelector),
        missing = collectMissingVariables(analysis.targets),
        result = nextSteps(stateSelector, rules, analysis)

    expect(result[0]).to.equal("contrat salarié . salaire de base")
    expect(result[1]).to.equal("contrat salarié . temps partiel")
  });

});
