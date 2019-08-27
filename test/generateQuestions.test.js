import { expect } from 'chai'
import {
	collectMissingVariables,
	getNextSteps
} from '../source/engine/generateQuestions'
import { enrichRule, rules as realRules } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'

let stateSelector = () => null

describe('collectMissingVariables', function() {
	it('should identify missing variables', function() {
		let rawRules = [
				{ nom: 'sum' },
				{
					nom: 'startHere',
					formule: 2,
					'non applicable si': 'sum . evt . ko',
					espace: 'sum'
				},
				{
					nom: 'evt',
					espace: 'sum',
					formule: { 'une possibilité': ['ko'] },
					titre: 'Truc',
					question: '?'
				},
				{ nom: 'ko', espace: 'sum . evt' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('sum . evt . ko')
	})

	it('should identify missing variables mentioned in expressions', function() {
		let rawRules = [
				{ nom: 'sum' },
				{ nom: 'evt', espace: 'sum' },
				{
					nom: 'startHere',
					formule: 2,
					'non applicable si': 'evt . nyet > evt . nope',
					espace: 'sum'
				},
				{ nom: 'nope', espace: 'sum . evt' },
				{ nom: 'nyet', espace: 'sum . evt' }
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
					nom: 'startHere',
					formule: 'trois',
					'non applicable si': '3 > 2',
					espace: 'sum'
				},
				{ nom: 'trois', espace: 'sum' }
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
					nom: 'startHere',
					formule: 'trois',
					'non applicable si': {
						'une de ces conditions': ['3 > 2', 'trois']
					},
					espace: 'sum'
				},
				{ nom: 'trois', espace: 'sum' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	it('should report "une possibilité" as a missing variable even though it has a formula', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: 'trois', espace: 'top' },
				{
					nom: 'trois',
					formule: { 'une possibilité': ['ko'] },
					espace: 'top'
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
				{ nom: 'startHere', formule: 'trois', espace: 'top' },
				{
					nom: 'trois',
					formule: { 'une possibilité': ['ko'] },
					'non applicable si': 1,
					espace: 'top'
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
				{ nom: 'startHere', formule: 'trois', espace: 'top' },
				{
					nom: 'trois',
					formule: { 'une possibilité': ['ko'] },
					espace: 'top'
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(mySelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	it('should report missing variables in switch statements', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						'aiguillage numérique': {
							'11 > dix': '1000%',
							'3 > dix': '1100%',
							'1 > dix': '1200%'
						}
					},
					espace: 'top'
				},
				{ nom: 'dix', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('top . dix')
	})

	// TODO : enlever ce test, depuis que l'on évalue plus les branches qui ne sont pas encore applicable
	it.skip('should report missing variables in variations', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: { somme: ['variations'] },
					espace: 'top'
				},
				{
					nom: 'variations',
					espace: 'top',
					formule: {
						barème: {
							assiette: 2008,
							variations: [
								{
									si: 'dix',
									alors: {
										multiplicateur: 'deux',
										tranches: [
											{ 'en-dessous de': 1, taux: 0.1 },
											{ de: 1, à: 2, taux: 'trois' },
											{ 'au-dessus de': 2, taux: 10 }
										]
									}
								},
								{
									si: '3 > 4',
									alors: {
										multiplicateur: 'quatre',
										tranches: [
											{ 'en-dessous de': 1, taux: 0.1 },
											{ de: 1, à: 2, taux: 1.8 },
											{ 'au-dessus de': 2, taux: 10 }
										]
									}
								}
							]
						}
					}
				},
				{ nom: 'dix', espace: 'top' },
				{ nom: 'deux', espace: 'top' },
				{ nom: 'trois', espace: 'top' },
				{ nom: 'quatre', espace: 'top' }
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

	it('should not report missing variables in switch for consequences of false conditions', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						'aiguillage numérique': {
							'8 > 10': '1000%',
							'1 > 2': 'dix'
						}
					},
					espace: 'top'
				},
				{ nom: 'dix', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})

	it('should report missing variables in consequence when its condition is unresolved', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						'aiguillage numérique': {
							'10 > 11': '1000%',
							'3 > dix': {
								douze: '560%',
								'1 > 2': '75015%'
							}
						}
					},
					espace: 'top'
				},
				{ nom: 'douze', espace: 'top' },
				{ nom: 'dix', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.include('top . dix')
		expect(result).to.include('top . douze')
	})

	it('should not report missing variables when a switch short-circuits', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						'aiguillage numérique': {
							'11 > 10': '1000%',
							'3 > dix': '1100%',
							'1 > dix': '1200%'
						}
					},
					espace: 'top'
				},
				{ nom: 'dix', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'startHere')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		expect(result).to.be.empty
	})
})

describe('nextSteps', function() {
	it('should generate questions for simple situations', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'sum', formule: 'deux', espace: 'top' },
				{
					nom: 'deux',
					formule: 2,
					'non applicable si': 'top . sum . evt',
					espace: 'top'
				},
				{
					nom: 'evt',
					espace: 'top . sum',
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
				{ nom: 'sum', formule: 'deux', espace: 'top' },
				{
					nom: 'deux',
					formule: 'sum . evt',
					espace: 'top'
				},
				{
					nom: 'evt',
					espace: 'top . sum',
					question: '?'
				}
			],
			rules = parseAll(rawRules.map(enrichRule)),
			analysis = analyse(rules, 'sum')(stateSelector),
			result = collectMissingVariables(analysis.targets)

		//		console.log('analysis', JSON.stringify(analysis, null, 4))

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})
	// todo : réflechir à l'applicabilité de ce test
	it.skip('should generate questions with more intricate situation', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'sum', formule: { somme: [2, 'deux'] }, espace: 'top' },
				{
					nom: 'deux',
					formule: 2,
					'non applicable si': "top . sum . evt = 'ko'",
					espace: 'top'
				},
				{
					nom: 'evt',
					espace: 'top . sum',
					formule: { 'une possibilité': ['ko'] },
					titre: 'Truc',
					question: '?'
				},
				{ nom: 'ko', espace: 'top . sum . evt' }
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
			analysis = analyse(rules, 'contrat salarié . rémunération . net')(
				stateSelector
			),
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
