import { expect } from 'chai'
import {
	collectMissingVariables,
	getNextSteps
} from '../source/engine/generateQuestions'
import { enrichRule, rules as realRules } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'

let stateSelector = () => undefined

describe('collectMissingVariables', function() {
	it('should identify missing variables', function() {
		let rawRules = [
				{ nom: 'sum' },
				{
					nom: 'sum . startHere',
					formule: 2,
					'non applicable si': 'sum . evt . ko'
				},
				{
					nom: 'sum . evt',
					formule: { 'une possibilité': ['ko'] },
					titre: 'Truc',
					question: '?'
				},
				{ nom: 'sum . evt . ko' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('sum . evt . ko')
	})

	it('should identify missing variables mentioned in expressions', function() {
		let rawRules = [
				{ nom: 'sum' },
				{ nom: 'sum . evt' },
				{
					nom: 'sum . startHere',
					formule: 2,
					'non applicable si': 'evt . nyet > evt . nope'
				},
				{ nom: 'sum . evt . nope' },
				{ nom: 'sum . evt . nyet' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('sum . evt . nyet')
		expect(result).to.include('sum . evt . nope')
	})

	it('should ignore missing variables in the formula if not applicable', function() {
		let rawRules = [
				{ nom: 'sum' },
				{
					nom: 'sum . startHere',
					formule: 'trois',
					'non applicable si': '3 > 2'
				},
				{ nom: 'sum . trois' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	it('should not report missing variables when "one of these" short-circuits', function() {
		let rawRules = [
				{ nom: 'sum' },
				{
					nom: 'sum . startHere',
					formule: 'trois',
					'non applicable si': {
						'une de ces conditions': ['3 > 2', 'trois']
					}
				},
				{ nom: 'sum . trois' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	it('should report "une possibilité" as a missing variable even though it has a formula', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . startHere', formule: 'trois' },
				{
					nom: 'top . trois',
					formule: { 'une possibilité': ['ko'] }
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('top . trois')
	})

	it('should not report missing variables when "une possibilité" is inapplicable', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . startHere', formule: 'trois' },
				{
					nom: 'top . trois',
					formule: { 'une possibilité': ['ko'] },
					'non applicable si': 1
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
		null
	})

	it('should not report missing variables when "une possibilité" was answered', function() {
		let mySelector = name => ({ 'top . trois': 'ko' }[name])

		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . startHere', formule: 'trois' },
				{
					nom: 'top . trois',
					formule: { 'une possibilité': ['ko'] }
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(mySelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	// TODO : enlever ce test, depuis que l'on évalue plus les branches qui ne sont pas encore applicable
	it.skip('should report missing variables in variations', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'top . startHere',
					formule: { somme: ['variations'] }
				},
				{
					nom: 'top . variations',
					formule: {
						barème: {
							assiette: 2008,
							variations: [
								{
									si: 'dix',
									alors: {
										multiplicateur: 'deux',
										tranches: [
											{ plafond: 1, taux: 0.1 },
											{ plafond: 2, taux: 'trois' },
											{ taux: 10 }
										]
									}
								},
								{
									si: '3 > 4',
									alors: {
										multiplicateur: 'quatre',
										tranches: [
											{ plafond: 1, taux: 0.1 },
											{ plafond: 2, taux: 1.8 },
											{ 'au-dessus de': 2, taux: 10 }
										]
									}
								}
							]
						}
					}
				},
				{ nom: 'top . dix' },
				{ nom: 'top . deux' },
				{ nom: 'top . trois' },
				{ nom: 'top . quatre' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('top . dix')
		expect(result).to.include('top . deux')
		expect(result).not.to.include('top . quatre')
		// TODO
		// expect(result).to.include('top . trois')
	})
})

describe('nextSteps', function() {
	it('should generate questions for simple situations', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . sum', formule: 'deux' },
				{
					nom: 'top . deux',
					formule: 2,
					'non applicable si': 'top . sum . evt'
				},
				{
					nom: 'top . sum . evt',
					titre: 'Truc',
					question: '?'
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'sum')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})
	it('should generate questions', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . sum', formule: 'deux' },
				{
					nom: 'top . deux',
					formule: 'sum . evt'
				},
				{
					nom: 'top . sum . evt',
					question: '?'
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'sum')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})
	// todo : réflechir à l'applicabilité de ce test
	it.skip('should generate questions with more intricate situation', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'top . sum', formule: { somme: [2, 'deux'] } },
				{
					nom: 'top . deux',
					formule: 2,
					'non applicable si': "top . sum . evt = 'ko'"
				},
				{
					nom: 'top . sum . evt',
					formule: { 'une possibilité': ['ko'] },
					titre: 'Truc',
					question: '?'
				},
				{ nom: 'top . sum . evt . ko' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'sum')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.have.lengthOf(2)
		expect(result).to.eql(['top . sum', 'top . sum . evt'])
	})

	it('should ask "motif CDD" if "CDD" applies', function() {
		let stateSelector = name =>
			({
				'contrat salarié': 'oui',
				'contrat salarié . CDD': 'oui',
				'contrat salarié . rémunération . brut de base': '2300'
			}[name])

		let rules = parseAll(realRules.map(enrichRule)),
			analysis = analyse(
				rules,
				'contrat salarié . rémunération . net'
			)(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('contrat salarié . CDD . motif')
	})
})

describe('getNextSteps', function() {
	it('should give priority to questions that advance most targets', function() {
		let missingVariablesByTarget = {
			chargé: {
				effectif: 34.01,
				cadre: 30
			},
			net: {
				cadre: 10.1
			},
			aides: {
				effectif: 32.0,
				cadre: 10
			}
		}

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('cadre')
	})

	it('should give priority to questions by total weight when advancing the same target count', function() {
		let missingVariablesByTarget = {
			chargé: {
				effectif: 24.01,
				cadre: 30
			},
			net: {
				effectif: 24.01,
				cadre: 10.1
			},
			aides: {}
		}

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('effectif')
	})
})
