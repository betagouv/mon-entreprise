import { expect } from 'chai'
import rules from 'Publicode/rules'
import Engine from '../source/engine/index'
import co2 from './rules/co2.yaml'
import sasuRules from './rules/sasu.yaml'

describe('library', function() {
	it('should evaluate one target with no input data', function() {
		let target = 'contrat salarié . rémunération . net'
		let engine = new Engine({ rules })
		engine.setSituation({
			'contrat salarié . rémunération . brut de base': 2300
		})
		expect(engine.evaluate(target).nodeValue).to.be.within(1798, 1800)
	})

	it('should let the user replace the default rules', function() {
		let rules = `
yo:
  formule: 200
ya:
  formule:  yo + 1
yi:
  formule:  yo + 2
`
		let engine = new Engine({ rules })

		expect(engine.evaluate('ya').nodeValue).to.equal(201)
		expect(engine.evaluate('yi').nodeValue).to.equal(202)
	})

	it.skip('should let the user add rules to the default ones', function() {
		let rules = `
yo:
  formule: 1
ya:
  formule:  contrat salarié . rémunération . net + yo
`
		let engine = new Engine({ extra: rules })
		engine.setSituation({
			'contrat salarié . rémunération . brut de base': 2300
		})
		expect(engine.evaluate('ya').nodeValue).to.be.closeTo(1799, 1)
	})

	it.skip(
		'should let the user extend the rules constellation in a serious manner',
		function() {
			let CA = 550 * 16
			let engine = new Engine({ extra: sasuRules })
			engine.setSituation({
				'chiffre affaires': CA
			})
			let salaireTotal = engine.evaluate('salaire total').nodeValue

			engine.setSituation({
				'contrat salarié . prix du travail': salaireTotal
			})
			let salaireNetAprèsImpôt = engine.evaluate(
				'contrat salarié . rémunération . net après impôt'
			).nodeValue

			engine.setSituation({
				'contrat salarié . rémunération . net après impôt': salaireNetAprèsImpôt,
				'chiffre affaires': CA
			})
			let [revenuDisponible, dividendes] = engine.evaluate([
				'contrat salarié . rémunération . net après impôt',
				'dividendes . net'
			])

			expect(revenuDisponible.nodeValue).to.be.closeTo(2324, 1)
			expect(dividendes.nodeValue).to.be.closeTo(2507, 1)
		}
	).timeout(5000)

	it('should let the user define a simplified revenue tax system', function() {
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
      décote:
        taux: 75%
        plafond: 1177
`

		let engine = new Engine({ rules })
		engine.setSituation({
			'revenu imposable': '48000'
		})
		let value = engine.evaluate('impôt sur le revenu à payer')
		expect(value.nodeValue).to.equal(7253.26)
	})

	it('should let the user define a rule base on a completely different subject', function() {
		let engine = new Engine({ rules: co2 })
		engine.setSituation({
			'nombre de douches': 30,
			'chauffage . type': 'gaz',
			'durée de la douche': 10
		})
		let value = engine.evaluate('douche . impact')
		expect(value.nodeValue).to.be.within(20, 21)
	})
})
