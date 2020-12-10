import { expect } from 'chai'
import Engine from '../source/index'
import co2 from './rules/co2.yaml'

describe('library', function () {
	it('should let the user define its own rule', function () {
		let rules = `
yo:
  formule: 200
ya:
  formule:  yo + 1
yi:
  formule:  yo + 2
`
		let engine = new Engine(rules)

		expect(engine.evaluate('ya').nodeValue).to.equal(201)
		expect(engine.evaluate('yi').nodeValue).to.equal(202)
	})

	it('should let the user define a simplified revenue tax system', function () {
		let rules = `
revenu imposable:
  question: Quel est votre revenu imposable ?
  unité: €

revenu abattu:
  formule:
    allègement:
      assiette: revenu imposable
      abattement: 10%

impôt sur le revenu:
  formule:
    barème:
      assiette: revenu abattu
      tranches:
        - taux: 0%
          plafond: 9807 €
        - taux: 14%
          plafond: 27086 €
        - taux: 30%
          plafond: 72617 €
        - taux: 41%
          plafond: 153783 €
        - taux: 45%

impôt sur le revenu à payer:
  formule:
    allègement:
			assiette: impôt sur le revenu
			abattement:
				valeur: 1177 - (75% * impôt sur le revenu)
				plancher: 0
`

		let engine = new Engine(rules)
		engine.setSituation({
			'revenu imposable': '48000',
		})
		let value = engine.evaluate('impôt sur le revenu à payer')
		expect(value.nodeValue).to.equal(7253.26)
	})

	it('should let the user define a rule base on a completely different subject', function () {
		let engine = new Engine(co2)
		engine.setSituation({
			'nombre de douches': 30,
			'chauffage . type': "'gaz'",
			'durée de la douche': 10,
		})
		let value = engine.evaluate('douche . impact')
		expect(value.nodeValue).to.be.within(20, 21)
	})

	it('should let the user reference rules in the situation', function () {
		let rules = `
referenced in situation:
  formule: 200
overwrited in situation:
  formule: 100
result:
  formule: overwrited in situation + 22
`
		let engine = new Engine(rules)
		engine.setSituation({
			'overwrited in situation': 'referenced in situation',
		})
		expect(engine.evaluate('result').nodeValue).to.equal(222)
	})
})
