import { expect } from 'chai'
import Syso from '../source/engine/index'
import co2 from '../source/règles/co2.yaml'
import sasuRules from '../source/règles/sasu.yaml'

describe('library', function() {
	it('should evaluate one target with no input data', function() {
		let target = 'contrat salarié . salaire . net'
		let value = Syso.evaluate(target, {
			'contrat salarié': { salaire: { 'brut de base': 2300 } }
		})
		expect(value).to.be.within(1798, 1800)
	})

	it('should let the user replace the default rules', function() {
		let rules = `
- nom: yo
  formule: 200
- nom: ya
  formule:  yo + 1
- nom: yi
  formule:  yo + 2
`

		let values = Syso.evaluate(['ya', 'yi'], {}, { base: rules })

		expect(values[0]).to.equal(201)
		expect(values[1]).to.equal(202)
	})
	it('should let the user add rules to the default ones', function() {
		let rules = `
- nom: yo
  formule: 1
- nom: ya
  période: flexible
  formule:  contrat salarié . salaire . net + yo
`

		let value = Syso.evaluate(
			'ya',
			{
				'contrat salarié . salaire . brut de base': 2300
			},
			{ extra: rules }
		)

		expect(value).to.be.closeTo(1799, 1)
	})
	it('should let the user extend the rules constellation in a serious manner', function() {
		let CA = 550 * 16
		let salaireTotal = Syso.evaluate(
			'salaire total',
			{
				'chiffre affaires': CA
			},
			{ extra: sasuRules }
		)

		let salaireNetAprèsImpôt = Syso.evaluate(
			'contrat salarié . salaire . net après impôt',
			{
				'contrat salarié': { rémunération: { total: salaireTotal } }
			}
		)

		let [revenuDisponible, dividendes] = Syso.evaluate(
			['revenu net après impôt', 'dividendes . net'],
			{
				'contrat salarié . salaire . net après impôt': salaireNetAprèsImpôt,
				'chiffre affaires': CA
			},
			{ extra: sasuRules }
		)

		expect(revenuDisponible).to.be.closeTo(2309, 1)
		expect(dividendes).to.be.closeTo(2507, 1)
	})

	it('should let the user define a simplified revenue tax system', function() {
		let règles = `
- nom:  revenu imposable
  question: Quel est votre revenu imposable ?
  unité: €

- nom: revenu abattu
  formule:
    allègement:
      assiette: revenu imposable
      abattement: 10%


- nom: impôt sur le revenu
  formule:
    barème:
      assiette: revenu abattu
      tranches:
        - en-dessous de: 9807
          taux: 0%
        - de: 9807
          à: 27086
          taux: 14%
        - de: 27086
          à: 72617
          taux: 30%
        - de: 72617
          à: 153783
          taux: 41%
        - au-dessus de: 153783
          taux: 45%


- nom: impôt sur le revenu à payer
  formule:
    allègement:
      assiette: impôt sur le revenu
      décote:
        plafond: 1177
        taux: 75%
`

		let target = 'impôt sur le revenu à payer'

		let value = Syso.evaluate(
			target,
			{ 'revenu imposable': '48000' },
			{ base: règles }
		)
		expect(value).to.equal(7253.26)
	})
	it('should let let user define a rule base on a completely different subject', function() {
		let targets = 'impact'

		let value = Syso.evaluate(
			targets,
			{
				'nombre de douches': 30,
				'chauffage . type': 'gaz',
				'durée de la douche': 10
			},
			{ base: co2, debug: false }
		)
		//console.log(JSON.stringify(value.targets[0], null, 4))
		expect(value).to.be.within(20, 21)
	})
})
