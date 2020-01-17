/*
	Les mécanismes sont testés dans mécanismes/ comme le sont les variables
	directement dans la base Publicode. On construit dans chaque fichier une base
	Publicode autonome, dans laquelle intervient le mécanisme à tester, puis on
	teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { expect } from 'chai'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import { enrichRule } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'
import { parseUnit } from '../source/engine/units'
import testSuites from './load-mecanism-tests'

describe('Mécanismes', () =>
	testSuites.map(([suiteName, suite]) =>
		Object.keys(suite)
			.map(key => [key, suite[key] ?? undefined])
			.map(
				([name, { exemples, titre, 'unité attendue': unit } = {}]) =>
					exemples &&
					describe(`Suite ${suiteName}, test : ${titre ?? name}`, () =>
						exemples.map(
							({
								nom: testTexte,
								situation,
								'valeur attendue': valeur,
								'variables manquantes': expectedMissing
							}) =>
								it(testTexte == null ? '' : testTexte + '', () => {
									let rules = parseAll(
											Object.entries(suite)
												.map(([dottedName, rule]) => ({
													dottedName,
													...rule
												}))
												.map(enrichRule)
										),
										state = situation || {},
										stateSelector = name => state[name],
										analysis = analyse(rules, name)(stateSelector),
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
										expect(target.unit).to.deep.equal(parseUnit(unit))
									}
								})
						))
			)
	))
