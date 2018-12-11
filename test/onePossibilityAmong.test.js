import { expect } from 'chai'
import { collectMissingVariables } from 'Engine/generateQuestions'
import { enrichRule } from 'Engine/rules'
import { analyse, parseAll } from 'Engine/traverse'

let stateSelector = () => null
describe('onePossibilityAmong', function() {
	describe.skip('value', () => {
		it('should throw if not all the possibility are defined as children of the namespace', function() {
			let rawRules = [
				{
					espace: 'entreprise',
					nom: 'statut',
					formule: {
						'une possibilité parmi': ['SARL', 'SAS']
					}
				},
				{
					espace: 'entreprise',
					nom: 'SARL'
				},
				{
					espace: 'entreprise . statut',
					nom: 'SAS'
				}
			]

			expect(parseAll(rawRules.map(enrichRule)).to.throw)(
				`Erreur dans l'arbre des règles : il manque la variable 'SARL' dans le namespace 'entreprise . statut'`
			)
		})
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
			expect(
				analyse(rules, 'entreprise . statut . SAS')(stateSelector).targets[0]
			).to.have.property('nodeValue', null)
		})
		it('should have mutually exclusive possibility', function() {
			let rawRules = [
					{
						espace: 'entreprise',
						nom: 'statut',
						formule: {
							'une possibilité parmi': ['SARL', 'SAS', 'EI']
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
					},
					{
						espace: 'entreprise . statut',
						nom: 'EI'
					}
				],
				rules = parseAll(rawRules.map(enrichRule))

			expect(
				analyse(rules, 'entreprise . statut . SAS')(stateSelector).targets[0]
			).to.have.property('nodeValue', 'non')
			expect(
				analyse(rules, 'entreprise . statut . EI')(stateSelector).targets[0]
			).to.have.property('nodeValue', 'non')
		})
		it('should throw when logical impossibility', function() {
			// TODO : use blocking control instead?
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

	describe('generateQuestion', function() {
		it('should not report missing variables when "une possibilité" is inapplicable', function() {
			let rawRules = [
					{
						espace: 'entreprise',
						nom: 'statut',
						question: 'Quel est le statut juridique de votre entreprise ?',
						formule: {
							'une possibilité parmi': ['SARL', 'SAS']
						},
						'non applicable si': 'oui'
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
				rules = parseAll(rawRules.map(enrichRule)),
				analysis = analyse(rules, 'entreprise . statut . SARL')(stateSelector),
				result = collectMissingVariables(analysis.targets)
			expect(result).to.be.empty
		})

		it('should not report missing variables when "une possibilité" was answered', function() {
			let mySelector = name => ({ 'entreprise . statut': 'SARL' }[name])
			let rawRules = [
					{
						espace: 'entreprise',
						nom: 'statut',
						question: 'Quel est le statut juridique de votre entreprise ?',
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
				rules = parseAll(rawRules.map(enrichRule)),
				analysis = analyse(rules, 'entreprise . statut . SAS')(mySelector),
				result = collectMissingVariables(analysis.targets)
			expect(result).to.be.empty
		})
		it('should report parent question as missing variable', function() {
			let rawRules = [
					{ nom: 'entreprise' },
					{
						espace: 'entreprise',
						nom: 'statut',
						question: 'Quel est le statut juridique de votre entreprise ?',
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
				rules = parseAll(rawRules.map(enrichRule)),
				analysis = analyse(rules, 'entreprise . statut . SARL')(stateSelector),
				result = collectMissingVariables(analysis.targets)
			expect(result).to.include('entreprise . statut')
		})
		it('should resolve children missing variables', function() {
			let rawRules = [
					{
						espace: 'entreprise',
						nom: 'statut',
						question: 'Quel est le statut juridique de votre entreprise ?',
						formule: {
							'une possibilité parmi': ['SARL', 'SAS']
						}
					},
					{
						espace: 'entreprise . statut',
						nom: 'SARL',
						'non applicable si': 'entreprise . dirigeant assimilé salarié'
					},
					{
						espace: 'entreprise . statut',
						nom: 'SAS'
					},
					{
						espace: 'entreprise',
						nom: 'dirigeant assimilé salarié',
						question: 'Le dirigeant est-il un assimilé salarié ?'
					}
				],
				rules = parseAll(rawRules.map(enrichRule)),
				analysis = analyse(rules, 'entreprise . statut . SAS')(stateSelector),
				result = collectMissingVariables(analysis.targets)
			expect(result).to.include('entreprise . dirigeant assimilé salarié')
		})
	})
})
