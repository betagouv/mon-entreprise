import {expect} from 'chai'
import {treatRuleRoot} from '../source/engine/traverse'
import {analyseSituation} from '../source/engine/traverse'

describe('treatRuleRoot', function() {

  let stateSelector = (state, name) => null

  it('should directly return simple numerical values', function() {
    let rule = {formule: 3269}
    expect(treatRuleRoot(stateSelector,[rule],rule)).to.have.property('nodeValue',3269)
  });

});

describe('analyseSituation', function() {

  let stateSelector = (state, name) => null

  it('should directly return simple numerical values', function() {
    let rule = {name: "startHere", formule: 3269}
    let rules = [rule]
    expect(analyseSituation(rules,"startHere")(stateSelector)).to.have.property('nodeValue',3269)
  });

});
