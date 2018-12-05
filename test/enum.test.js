import { expect } from 'chai'
import { enrichRule } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'

let stateSelector = () => null
describe('intersections', function() {
	it('should be undetermined by default', function() {
		let rawRules = [
				{
					espace: 'entreprise',
					nom: 'statut',
					formule: {
						'une possibilité parmi': ['SARL', 'SAS']
					}
				},
				{
					espace: 'entreprise . statut',
					nom: 'SARL'
				},
				{
					espace: 'entreprise . statut',
					nom: 'SAS'
				}
			],
			rules = parseAll(rawRules.map(enrichRule))

		expect(
			analyse(rules, 'entreprise')(stateSelector).targets[0]
		).to.have.property('nodeValue', null)
	})
	it('should have mutually exclusive possibility', function() {
		let rawRules = [
				{
					espace: 'entreprise',
					nom: 'statut',
					formule: {
						'une possibilité parmi': ['SARL', 'SAS']
					}
				},
				{
					espace: 'entreprise . statut',
					nom: 'SARL',
					formule: 'oui'
				},
				{
					espace: 'entreprise . statut',
					nom: 'SAS'
				}
			],
			rules = parseAll(rawRules.map(enrichRule))

		expect(
			analyse(rules, 'entreprise . statut . SAS')(stateSelector).targets[0]
		).to.have.property('nodeValue', 'non')
		expect(
			analyse(rules, 'entreprise . statut')(stateSelector).targets[0]
		).to.have.property('nodeValue', 'SAS')
	})
	it('should throw when logical impossibility', function() {
		let rawRules = [
				{
					espace: 'entreprise',
					nom: 'statut',
					formule: {
						'une possibilité parmi': ['SARL', 'SAS']
					}
				},
				{
					espace: 'entreprise . statut',
					nom: 'SARL',
					formule: 'oui'
				},
				{
					espace: 'entreprise . statut',
					nom: 'SAS',
					formule: 'oui'
				}
			],
			rules = parseAll(rawRules.map(enrichRule))

		expect(
			() => analyse(rules, 'entreprise . statut')(stateSelector).targets[0]
		).to.throw(
			`Impossibilité logique : 'entreprise . statut' ne peut pas être à la fois 'SARL' et 'SAS'`
		)
	})
	it('should handle applicability', function() {
		let rawRules = [
				{
					espace: 'entreprise',
					nom: 'statut',
					formule: {
						'une possibilité parmi': ['SARL', 'SAS']
					}
				},
				{
					espace: 'entreprise . statut',
					nom: 'SARL',
					'applicable si': 'dirigeant . assimilé salarié'
				},
				{
					espace: 'entreprise . statut',
					nom: 'SAS',
					'applicable si': 'dirigeant . indépendant'
				},
				{
					espace: 'entreprise',
					nom: 'dirigeant',
					'une possibilité parmi': ['indépendant', 'assimilé salarié']
				},
				{
					espace: 'entreprise . dirigeant',
					nom: 'indépendant'
				},
				{
					espace: 'entreprise . dirigeant',
					nom: 'assimilé salarié',
					formule: 'oui'
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'entreprise . statut . SAS')(stateSelector).targets[0]
		).to.have.property('nodeValue', 'oui')
		expect(
			analyse(rules, 'entreprise . statut')(stateSelector).targets[0]
		).to.have.property('nodeValue', 'SAS')
	})
})
