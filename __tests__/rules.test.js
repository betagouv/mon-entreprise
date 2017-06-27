import {expect} from 'chai'
import {enrichRule} from '../source/engine/rules'

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
