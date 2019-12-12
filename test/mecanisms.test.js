/*
	Les mécanismes sont testés dans mécanismes/ comme le sont les variables directement dans la base YAML.
	On construit dans chaque fichier une base YAML autonome, dans laquelle intervient le mécanisme à tester,
	puis on teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { expect } from 'chai'
import { serialiseUnit } from 'Engine/units'
import * as R from 'ramda'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import { enrichRule } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'
import testSuites from './load-mecanism-tests'

describe('Mécanismes', () =>
	testSuites.map(([suiteName, suite]) =>
		suite.map(
			({ exemples, test, 'unité attendue': unit }) =>
				exemples &&
				describe(`Suite ${suiteName}, test : ${test ||
					'Nom de test (propriété "test") manquant dans la variable contenant ces "exemples"'}`, () =>
					exemples.map(
						({
							nom: testTexte,
							situation,
							'unités par défaut': defaultUnits,
							'valeur attendue': valeur,
							'variables manquantes': expectedMissing
						}) =>
							it(testTexte == null ? '' : testTexte + '', () => {
								let rules = parseAll(
										suite
											.map(item =>
												item.test != null
													? R.assoc('nom', item.test, item)
													: item
											)
											.map(enrichRule)
									),
									state = situation || {},
									stateSelector = name => state[name],
									analysis = analyse(rules, test, defaultUnits)(stateSelector),
									missing = collectMissingVariables(analysis.targets),
									target = analysis.targets[0]

								if (typeof valeur === 'number') {
									expect(target.nodeValue).to.be.closeTo(valeur, 0.001)
								} else if (valeur !== undefined) {
									expect(target).to.have.property('nodeValue', valeur)
								}

								if (expectedMissing) {
									expect(missing).to.eql(expectedMissing)
								}

								if (unit) {
									expect(target.unit).not.to.be.equal(undefined)
									expect(serialiseUnit(target.unit)).to.eql(unit)
								}
							})
					))
		)
	))
