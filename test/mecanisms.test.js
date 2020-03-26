/*
	Les mécanismes sont testés dans mécanismes/ comme le sont les variables
	directement dans la base Publicode. On construit dans chaque fichier une base
	Publicode autonome, dans laquelle intervient le mécanisme à tester, puis on
	teste idéalement tous ses comportements sans en faire intervenir d'autres.
*/

import { expect } from 'chai'
import Engine from 'Engine'
import { parseUnit } from '../source/engine/units'
import testSuites from './load-mecanism-tests'
testSuites.forEach(([suiteName, suite]) => {
	const engine = new Engine({ rules: suite, useDefaultValues: false })
	describe(`Mécanisme ${suiteName}`, () => {
		Object.entries(suite)
			.filter(([, rule]) => rule?.exemples)
			.forEach(([name, test]) => {
				const { exemples, 'unité attendue': unit } = test
				exemples.forEach(
					(
						{
							nom: testName,
							situation,
							'unités par défaut': defaultUnits,
							'valeur attendue': valeur,
							'variables manquantes': expectedMissing
						},
						i
					) => {
						it(
							name +
								(testName
									? ` [${testName}]`
									: exemples.length > 1
									? ` (${i + 1})`
									: ''),
							() => {
								const result = engine
									.setSituation(situation ?? {})
									.setDefaultUnits(defaultUnits)
									.evaluate(name)
								if (typeof valeur === 'number') {
									expect(result.nodeValue).to.be.closeTo(valeur, 0.001)
								} else if (valeur !== undefined) {
									expect(result.nodeValue).to.be.eq(valeur)
								}
								if (expectedMissing) {
									expect(Object.keys(result.missingVariables)).to.eql(
										expectedMissing
									)
								}
								if (unit) {
									expect(result.unit).not.to.be.equal(undefined)
									expect(result.unit).to.deep.equal(parseUnit(unit))
								}
							}
						)
					}
				)
			})
	})
})
