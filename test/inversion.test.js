import { expect } from "chai"
import { enrichRule } from "../source/engine/rules"
import { analyseSituation } from "../source/engine/traverse"
import yaml from "js-yaml"
import dedent from 'dedent-js'

describe("inversions", () => {
	/*
  it("should handle non inverted example", () => {
    let fakeState = { brut: 2300 }
    let stateSelector = name => fakeState[name]

    let
			rawRules = dedent`
				- nom: net
				  formule:
				    multiplication:
				      assiette: brut
				      taux: 77%

				- nom: brut
				  format: euro
			`,
      rules = yaml.safeLoad(rawRules).map(enrichRule),
      analysis = analyseSituation(rules, "net")(stateSelector)

    expect(analysis.nodeValue).to.be.closeTo(1771, 0.001)
  })
	*/

	it("should handle inversions", () => {
		let fakeState = { net: 2000 }
		let stateSelector = name => fakeState[name]

		let
			rawRules = dedent`
				- nom: net
				  formule:
				    multiplication:
				      assiette: brut
				      taux: 77%

				- nom: brut
				  format: euro
				  inversions possibles: 
				    - net
			`,
			rules = yaml.safeLoad(rawRules).map(enrichRule),
			analysis = analyseSituation(rules, "brut")(stateSelector)

		expect(analysis.nodeValue).to.be.closeTo(2570, 0.001)
	})
})
