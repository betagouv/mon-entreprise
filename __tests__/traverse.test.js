import {expect} from 'chai'
import {treatRuleRoot} from '../source/engine/traverse'

describe('treatRuleRoot', function() {

  let stateSelector = (state, name) => null

  it('should directly return simple numerical values', function() {
    let rule = {formule: 3269}
    expect(treatRuleRoot(stateSelector,rule)).to.have.property('nodeValue',3269)
  });

});
