import { expect } from 'chai'
import Engine from 'Engine'
import rules from 'Rules'
import { getNextSteps } from '../source/components/utils/useNextQuestion'

describe('Missing variables', function() {
	it('should identify missing variables', function() {
		const rawRules = {
			sum: {},
			'sum . startHere': {
				formule: 2,
				'non applicable si': 'sum . evt . ko'
			},
			'sum . evt': {
				formule: { 'une possibilité': ['ko'] },
				titre: 'Truc',
				question: '?'
			},
			'sum . evt . ko': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.include('sum . evt . ko')
	})

	it('should identify missing variables mentioned in expressions', function() {
		const rawRules = {
			sum: {},
			'sum . evt': {},
			'sum . startHere': {
				formule: 2,
				'non applicable si': 'evt . nyet > evt . nope'
			},
			'sum . evt . nope': {},
			'sum . evt . nyet': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.include('sum . evt . nyet')
		expect(result).to.include('sum . evt . nope')
	})

	it('should ignore missing variables in the formula if not applicable', function() {
		const rawRules = {
			sum: {},
			'sum . startHere': {
				formule: 'trois',
				'non applicable si': '3 > 2'
			},
			'sum . trois': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	it('should not report missing variables when "one of these" short-circuits', function() {
		const rawRules = {
			sum: {},
			'sum . startHere': {
				formule: 'trois',
				'non applicable si': {
					'une de ces conditions': ['3 > 2', 'trois']
				}
			},
			'sum . trois': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	it('should report "une possibilité" as a missing variable even though it has a formula', function() {
		const rawRules = {
			top: {},
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] }
			}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . startHere').missingVariables
		)

		expect(result).to.include('top . trois')
	})

	it('should not report missing variables when "une possibilité" is inapplicable', function() {
		const rawRules = {
			top: {},
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] },
				'non applicable si': 1
			}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . startHere').missingVariables
		)

		expect(result).to.be.empty
		null
	})

	it('should not report missing variables when "une possibilité" was answered', function() {
		const rawRules = {
			top: {},
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] }
			}
		}
		const result = Object.keys(
			new Engine(rawRules)
				.setSituation({ 'top . trois': "'ko'" })
				.evaluate('top . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	// TODO : réparer ce test
	it.skip('should report missing variables in variations', function() {
		const rawRules = {
			top: {},
			'top . startHere': {
				formule: { somme: ['variations'] }
			},
			'top . variations': {
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
			'top . dix': {},
			'top . deux': {},
			'top . trois': {},
			'top . quatre': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . startHere').missingVariables
		)

		expect(result).to.include('top . dix')
		expect(result).to.include('top . deux')
		expect(result).to.include('top . trois')
		expect(result).not.to.include('top . quatre')
	})
})

describe('nextSteps', function() {
	it('should generate questions for simple situations', function() {
		const rawRules = {
			top: {},
			'top . sum': { formule: 'deux' },
			'top . deux': {
				formule: 2,
				'non applicable si': 'top . sum . evt'
			},
			'top . sum . evt': {
				titre: 'Truc',
				question: '?'
			}
		}

		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})
	it('should generate questions', function() {
		const rawRules = {
			top: {},
			'top . sum': { formule: 'deux' },
			'top . deux': {
				formule: 'sum . evt'
			},
			'top . sum . evt': {
				question: '?'
			}
		}

		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})

	it('should generate questions with more intricate situation', function() {
		const rawRules = {
			top: {},
			'top . sum': { formule: { somme: [2, 'deux'] } },
			'top . deux': {
				formule: 2,
				'non applicable si': "top . sum . evt = 'ko'"
			},
			'top . sum . evt': {
				formule: { 'une possibilité': ['ko'] },
				titre: 'Truc',
				question: '?'
			},
			'top . sum . evt . ko': {}
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.eql(['top . sum . evt'])
	})

	it('should ask "motif CDD" if "CDD" applies', function() {
		const result = Object.keys(
			new Engine(rules)
				.setSituation({
					'contrat salarié': 'oui',
					'contrat salarié . CDD': 'oui',
					'contrat salarié . rémunération . brut de base': '2300'
				})
				.evaluate('contrat salarié . rémunération . net', {
					useDefaultValues: false
				}).missingVariables
		)

		expect(result).to.include('contrat salarié . CDD . motif')
	})
})

describe('getNextSteps', function() {
	it('should give priority to questions that advance most targets', function() {
		let missingVariablesByTarget = [
			{
				effectif: 34.01,
				cadre: 30
			},
			{
				cadre: 10.1
			},
			{
				effectif: 32.0,
				cadre: 10
			}
		]

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('cadre')
	})

	it('should give priority to questions by total weight when advancing the same target count', function() {
		let missingVariablesByTarget = [
			{
				effectif: 24.01,
				cadre: 30
			},
			{
				effectif: 24.01,
				cadre: 10.1
			},
			{}
		]

		let result = getNextSteps(missingVariablesByTarget)

		expect(result[0]).to.equal('effectif')
	})
})
