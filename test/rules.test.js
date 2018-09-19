import { map } from 'ramda'
import { expect } from 'chai'
import {
	rules,
	disambiguateRuleReference,
	ruleParents,
	enrichRule,
	translateAll,
	nestedSituationToPathMap
} from '../source/engine/rules'

let stateSelector = (state, name) => null

describe('enrichRule', function() {
	it('should extract the type of the rule', function() {
		let rule = { nom: 'retraite', cotisation: {} }
		expect(enrichRule(rule)).to.have.property('type', 'cotisation')
	})

	it('should load external data into the rule', function() {
		let data = { taux_versement_transport: { one: 'two' } }
		let rule = {
			nom: 'retraite',
			cotisation: {},
			données: 'taux_versement_transport'
		}
		expect(enrichRule(rule, data)).to.have.deep.property('data', { one: 'two' })
	})

	it('should extract the dotted name of the rule', function() {
		let rule = { espace: 'contrat salarié', nom: 'CDD' }
		expect(enrichRule(rule)).to.have.property('name', 'CDD')
		expect(enrichRule(rule)).to.have.property(
			'dottedName',
			'contrat salarié . CDD'
		)
	})

	it('should render Markdown in sub-questions', function() {
		let rule = { nom: 'quoi', 'sous-question': '**wut**' }
		expect(enrichRule(rule)).to.have.property(
			'subquestion',
			'<p><strong>wut</strong></p>\n'
		)
	})
})

describe('rule checks', function() {
	it('most input rules should have defaults', function() {
		let rulesNeedingDefault = rules.filter(
			r =>
				r.espace &&
				!r.simulateur &&
				(!r.formule || r.formule['une possibilité']) &&
				r.defaultValue == null &&
				r.question
		)

		rulesNeedingDefault.map(r =>
			console.log(
				'cette règle, ',
				r.dottedName,
				'devrait avoir une valeur par défaut'
			)
		)
		expect(rulesNeedingDefault).to.be.empty
	})
	it('rules with a period should not have a flexible period', function() {
		let problems = rules.filter(
			({ defaultValue, période }) => période === 'flexible' && defaultValue
		)

		problems.map(({ dottedName }) =>
			console.log(
				'La valeur règle ',
				dottedName,
				" a une période flexible et une valeur par défaut. C'est un problème, car on ne sait pas pour quelle période ce défaut est défini. "
			)
		)
		expect(problems).to.be.empty
	})
})

it('rules with a formula should not have defaults', function() {
	let errors = rules.filter(
		r =>
			r.formule !== undefined &&
			!r.formule['une possibilité'] &&
			r.defaultValue !== undefined
	)

	// variant formulas are an exception, their implementation is to refactor TODO
	expect(errors).to.be.empty
})
describe('translateAll', function() {
	it('should translate flat rules', function() {
		let rules = [
			{
				espace: 'foo',
				nom: 'bar',
				titre: 'Titre',
				description: 'Description',
				question: 'Question',
				'sous-question': 'Sous Question'
			}
		]
		let translations = {
			'foo . bar': {
				'titre.en': 'TITRE',
				'description.en': 'DESC',
				'question.en': 'QUEST',
				'sous-question.en': 'SOUSQ'
			}
		}

		let result = translateAll(translations, map(enrichRule, rules))

		expect(result[0]).to.have.property('titre', 'TITRE')
		expect(result[0]).to.have.property('description', 'DESC')
		expect(result[0]).to.have.property('question', 'QUEST')
		expect(result[0]).to.have.property('sous-question', 'SOUSQ')
	})
})
describe('misc', function() {
	it('should unnest nested form values', function() {
		let values = {
			'contrat salarié': { salaire: { 'brut de base': '2300' } }
		}

		let pathMap = nestedSituationToPathMap(values)

		expect(pathMap).to.have.property(
			'contrat salarié . salaire . brut de base',
			'2300'
		)
	})
	it('should procude an array of the parents of a rule', function() {
		let rawRules = [
			{ nom: 'CDD', question: 'CDD ?' },
			{ nom: 'taxe', formule: 'montant annuel / 12', espace: 'CDD' },
			{
				nom: 'montant annuel',
				formule: '20 - exonération annuelle',
				espace: 'CDD . taxe'
			},
			{
				nom: 'exonération annuelle',
				formule: 20,
				espace: 'CDD . taxe . montant annuel'
			}
		]

		let parents = ruleParents(rawRules.map(enrichRule)[3].dottedName)
		expect(parents).to.eql([
			['CDD', 'taxe', 'montant annuel'],
			['CDD', 'taxe'],
			['CDD']
		])
	})
	it("should disambiguate a reference to another rule in a rule, given the latter's namespace", function() {
		let rawRules = [
			{ nom: 'CDD', question: 'CDD ?' },
			{ nom: 'taxe', formule: 'montant annuel / 12', espace: 'CDD' },
			{
				nom: 'montant annuel',
				formule: '20 - exonération annuelle',
				espace: 'CDD . taxe'
			},
			{
				nom: 'exonération annuelle',
				formule: 20,
				espace: 'CDD . taxe . montant annuel'
			}
		]

		let enrichedRules = rawRules.map(enrichRule),
			resolved = disambiguateRuleReference(
				enrichedRules,
				enrichedRules[2],
				'exonération annuelle'
			)
		expect(resolved).to.eql(
			'CDD . taxe . montant annuel . exonération annuelle'
		)
	})
})
