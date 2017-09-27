/*
  Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
  On y créée dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
  puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import {expect} from 'chai'
import {enrichRule} from '../source/engine/rules'
import {analyseTopDown} from '../source/engine/traverse'
import {collectMissingVariables} from '../source/engine/generateQuestions'
import testSuites from './load-mecanism-tests'
import R from 'ramda'

// By luck this works as expected for both null and undefined, * but with different branches failing :O *
let isFloat = n => Number(n) === n && n % 1 !== 0

describe('Mécanismes', () =>
  testSuites.map( suite =>
    suite.map(({exemples, nom, test}) =>
      exemples && describe(test || 'Nom de test (propriété "test") manquant dans la variable contenant ces "exemples"', () =>
        exemples.map(({nom: testTexte, situation, 'valeur attendue': valeur, 'variables manquantes': expectedMissing}) =>
          it(testTexte + '', () => {

            let rules = suite.map(enrichRule),
              state = situation || {},
              stateSelector = name => state[name],
              analysis = analyseTopDown(rules, nom)(stateSelector),
              missing = collectMissingVariables()(stateSelector,analysis)

            // console.log('JSON.stringify(analysis', JSON.stringify(analysis))
            if (isFloat(valeur)) {
              expect(analysis.root.nodeValue).to.be.closeTo(valeur,0.001)
            }
            else if (valeur !== undefined) {
              expect(analysis.root)
                .to.have.property(
                  'nodeValue',
                  valeur
                )
            }

            if (expectedMissing) {
              expect(R.keys(missing).sort()).to.eql(expectedMissing.sort())
            }

          })
        )
    ))
  )
)
