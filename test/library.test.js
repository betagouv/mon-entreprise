import { expect } from 'chai'
import Syso from '../source/engine/index'
import { propEq } from 'ramda'
import sasuRules from '../source/règles/sasu.yaml'

describe('library', function() {
	it('should evaluate one target with no input data', function() {
		let target = 'contrat salarié . salaire . net'
		let value = Syso.evaluate(target, {
			'contrat salarié': { salaire: { 'brut de base': 2300 } }
		})
		expect(value).to.be.within(1800, 1803)
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
  formule:  contrat salarié . salaire . net + yo
`

		let value = Syso.evaluate(
			'ya',
			{
				'contrat salarié . salaire . brut de base': 2300
			},
			{ extra: rules }
		)

		expect(value).to.be.closeTo(1802, 1)
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

		console.log({ salaireTotal })
		let salaireNetAprèsImpôt = Syso.evaluate(
			'contrat salarié . salaire . net après impôt',
			{
				'contrat salarié': { rémunération: { total: salaireTotal } }
			}
		)

		console.log({ salaireNetAprèsImpôt })

		let [revenuDisponible, dividendes] = Syso.evaluate(
			['revenu disponible', 'dividendes . net'],
			{
				'net après impôt': salaireNetAprèsImpôt,
				'chiffre affaires': CA
			},
			{ extra: sasuRules }
		)
		console.log({ revenuDisponible, dividendes })
	})
})
