/*
  Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
  On y créée dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
  puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import {expect} from 'chai'
import {enrichRule} from '../source/engine/rules'
import {analyseSituation} from '../source/engine/traverse'
import testBatteries from './load-mecanism-tests'


describe('Mécanismes', () =>
  testBatteries.map( battery =>
    battery.map(({exemples, nom, test}) =>
      exemples && describe(test || 'Nom de test (propriété "test") manquant dans la variable contenant ces "exemples"', () =>
        exemples.map(({nom: testTexte, situation, 'valeur attendue': valeur}) =>
          it(testTexte + '', () => {
            let rules = battery.map(enrichRule),
              state = situation || {},
              analysis = analyseSituation(rules, nom)(name => state[name])

              // console.log('JSON.stringify(analysis', JSON.stringify(analysis))
            expect(analysis)
              .to.have.property(
                'nodeValue',
                valeur
              )
          })
        )
    ))
  )
)
