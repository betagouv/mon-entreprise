/*
	Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
	On construit dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
	puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { expect } from 'chai'
import { enrichRule } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import testSuites from './load-mecanism-tests'
import * as R from 'ramda'
import { isFloat } from '../source/utils'

describe('Mécanismes', () =>
	testSuites.map(suite =>
		suite.map(
			({ exemples, test }) =>
				exemples &&
				describe(
					test ||
						'Nom de test (propriété "test") manquant dans la variable contenant ces "exemples"',
					() =>
						exemples.map(
							({
								nom: testTexte,
								situation,
								'valeur attendue': valeur,
								'variables manquantes': expectedMissing
							}) =>
								it(testTexte == null ? '' : testTexte + '', () => {
									let rules = parseAll(
											suite
												.map(
													item =>
														item.test != null
															? R.assoc('nom', item.test, item)
															: item
												)
												.map(enrichRule)
										),
										state = situation || {},
										stateSelector = name => state[name],
										analysis = analyse(rules, test)(stateSelector),
										missing = collectMissingVariables(analysis.targets),
										target = analysis.targets[0]

									// console.log('JSON.stringify(analysis', JSON.stringify(analysis))
									if (isFloat(valeur)) {
										expect(target.nodeValue).to.be.closeTo(valeur, 0.001)
									} else if (valeur !== undefined) {
										expect(target).to.have.property('nodeValue', valeur)
									}

									if (expectedMissing) {
										expect(missing).to.eql(expectedMissing)
									}
								})
						)
				)
		)
	))
