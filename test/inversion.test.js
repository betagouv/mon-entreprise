import { expect } from 'chai'
import dedent from 'dedent-js'
import yaml from 'js-yaml'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import { enrichRule, rules as realRules } from '../source/engine/rules'
import { analyse, analyseMany, parseAll } from '../source/engine/traverse'

describe('inversions', () => {
	it('should handle non inverted example', () => {
		let fakeState = { brut: 2300 }
		let stateSelector = name => fakeState[name]

		let rawRules = dedent`
        - nom: net
          formule:
            multiplication:
              assiette: brut
              taux: 77%

        - nom: brut
          format: euro
      `,
			rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
			analysis = analyse(rules, 'net')(stateSelector)

		expect(analysis.targets[0].nodeValue).to.be.closeTo(1771, 0.001)
	})

	it('should handle simple inversion', () => {
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
          formule:
            inversion:
              avec:
                - net
      `,
			rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
			analysis = analyse(rules, 'brut')(stateSelector)

		expect(analysis.targets[0].nodeValue).to.be.closeTo(
			2000 / (77 / 100),
			0.0001 * 2000
		)
	})

	it('should ask the input of one of the possible inversions', () => {
		let rawRules = dedent`
        - nom: net
          formule:
            multiplication:
              assiette: assiette
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - sinon:
                    taux: 70%

        - nom: brut
          format: euro
          formule:
            inversion:
              avec:
                - net
        - nom: cadre
        - nom: assiette
          formule: 67 + brut

      `,
			rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
			stateSelector = () => null,
			analysis = analyse(rules, 'brut')(stateSelector),
			missing = collectMissingVariables(analysis.targets)

		expect(analysis.targets[0].nodeValue).to.be.null
		expect(missing).to.include('brut')
	})

	it('should handle inversions with missing variables', () => {
		let rawRules = dedent`
        - nom: net
          formule:
            multiplication:
              assiette: assiette
              variations:
                - si: cadre
                  alors: 
                    taux: 80%
                - sinon:
                    taux: 70%

        - nom: brut
          format: euro
          formule:
            inversion:
              avec:
                - net
        - nom: cadre
        - nom: assiette
          formule:
            somme:
              - 1200
              - brut
              - taxeOne
        - nom: taxeOne
          non applicable si: cadre
          formule: taxe + taxe
        - nom: taxe
          formule:
            multiplication:
              assiette: 1200
              variations:
                - si: cadre
                  alors: 
                    taux: 80%
                - sinon:
                    taux: 70%
      `,
			rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
			stateSelector = name => ({ net: 2000 }[name]),
			analysis = analyse(rules, 'brut')(stateSelector),
			missing = collectMissingVariables(analysis.targets)

		expect(analysis.targets[0].nodeValue).to.be.null
		expect(missing).to.include('cadre')
	})

	it("shouldn't report a missing salary if another salary was input", () => {
		let rawRules = dedent`
        - nom: net
          formule:
            multiplication:
              assiette: assiette
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - si: ≠ cadre
                  alors: 
                    taux: 70%

        - nom: total
          formule:
            multiplication:
              assiette: assiette
              taux: 150%

        - nom: brut
          format: euro
          formule:
            inversion:
              avec:
                - net
                - total

        - nom: cadre

        - nom: assiette
          formule: 67 + brut

      `,
			rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
			stateSelector = name => ({ net: 2000, cadre: 'oui' }[name]),
			analysis = analyse(rules, 'total')(stateSelector),
			missing = collectMissingVariables(analysis.targets)

		expect(analysis.targets[0].nodeValue).to.equal(3750)
		expect(missing).to.be.empty
	})
})

it('complex inversion with composantes', () => {
	let rawRules = dedent`
      - nom: net
        formule:
          multiplication:
            assiette: 67 + brut
            taux: 80%

      - nom: cotisation
        formule:
          multiplication:
            assiette: 67 + brut
            composantes:
              - attributs:
                  dû par: employeur
                taux: 100%
              - attributs:
                  dû par: salarié
                taux: 50%

      - nom: total
        formule: cotisation (employeur) + cotisation (salarié)

      - nom: brut
        format: euro
        formule:
          inversion:
            avec:
              - net
              - total
    `,
		rules = parseAll(yaml.safeLoad(rawRules).map(enrichRule)),
		stateSelector = name => ({ net: 2000 }[name]),
		analysis = analyse(rules, 'total')(stateSelector),
		missing = collectMissingVariables(analysis.targets)

	expect(analysis.targets[0].nodeValue).to.equal(3750)
	expect(missing).to.be.empty
})

it('should collect missing variables not too slowly', function() {
	let stateSelector = name =>
		({ 'contrat salarié . salaire . net': '2300' }[name])

	let rules = parseAll(realRules.map(enrichRule)),
		analysis = analyseMany(rules, [
			'contrat salarié . salaire . brut',
			'contrat salarié . rémunération . total'
		])(stateSelector)

	let start = Date.now()
	collectMissingVariables(analysis.targets)
	let elapsed = Date.now() - start
	expect(elapsed).to.be.below(500)
})
