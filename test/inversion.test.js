import { expect } from "chai"
import { enrichRule } from "../source/engine/rules"
import { analyse } from "../source/engine/traverse"
import { collectMissingVariables } from "../source/engine/generateQuestions"
import yaml from "js-yaml"
import dedent from "dedent-js"

describe("inversions", () => {
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
      analysis = analyse(rules, "net")(stateSelector)

    expect(analysis.targets[0].nodeValue).to.be.closeTo(1771, 0.001)
  })


  it("should handle inversions", () => {
    let fakeState = { net: 2000 }
    let stateSelector = name => fakeState[name]

    let rawRules = dedent`
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
      analysis = analyse(rules, "brut")(stateSelector)

    expect(analysis.targets[0].nodeValue).to.be.closeTo(2000 / (77 / 100), 0.0001 * 2000)
  })

  it("should handle inversions with missing variables", () => {
    let rawRules = dedent`
				- nom: net
				  formule:
				    multiplication:
				      assiette: assiette
				      variations:
				        - si: cadre
				          taux: 80%
				        - si: ≠ cadre
				          taux: 70%

				- nom: brut
				  format: euro
				  inversions possibles:
				    - net
				- nom: cadre
				- nom: assiette
				  formule: 67 + brut

			`,
      rules = yaml.safeLoad(rawRules).map(enrichRule),
      stateSelector = name => ({ net: 2000 }[name]),
      analysis = analyse(rules, "brut")(stateSelector),
      missing = collectMissingVariables(analysis.targets)

    expect(analysis.targets[0].nodeValue).to.be.null
    expect(missing).to.have.key("cadre")
  })

  it("shouldn't report a missing salary if another salary was input", () => {
    let rawRules = dedent`
        - nom: net
          formule:
            multiplication:
              assiette: assiette
              variations:
                - si: cadre
                  taux: 80%
                - si: ≠ cadre
                  taux: 70%

        - nom: total
          formule:
            multiplication:
              assiette: assiette
              taux: 150%

        - nom: brut
          format: euro
          inversions possibles:
            - net
            - total

        - nom: cadre

        - nom: assiette
          formule: 67 + brut

      `,
      rules = yaml.safeLoad(rawRules).map(enrichRule),
      stateSelector = name => ({ net: 2000, cadre: 'oui' }[name]),
      analysis = analyse(rules, "total")(stateSelector),
      missing = collectMissingVariables(analysis.targets)

    expect(analysis.targets[0].nodeValue).to.equal(3750)
    expect(missing).to.be.empty
  })

})
