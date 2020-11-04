import { expect } from 'chai'
import Engine from '../source/index'

describe('Missing variables', function() {
	it('should identify missing variables', function() {
		const rawRules = {
			ko: 'oui',
			sum: 'oui',
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

		expect(result).to.include('sum . evt')
	})

	it('should identify missing variables mentioned in expressions', function() {
		const rawRules = {
			sum: 'oui',
			'sum . evt': 'oui',
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
			sum: 'oui',
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
			sum: 'oui',
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
			top: 'oui',
			ko: 'oui',
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
			top: 'oui',
			ko: 'oui',
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] },
				'non applicable si': 'oui'
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
			top: 'oui',
			ko: 'oui',
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
			top: 'oui',
			'top . startHere': {
				formule: { somme: ['variations'] }
			},
			'top . variations': {
				formule: {
					variations: [
						{
							si: 'dix',
							alors: {
								barème: {
									assiette: 2008,
								multiplicateur: 'deux',
								tranches: [
									{ plafond: 1, taux: 0.1 },
									{ plafond: 2, taux: 'trois' },
									{ taux: 10 }
								]
								}
							}},
							{
								si: '3 > 4',
								alors: {
									barème: {
										assiette: 2008,
									multiplicateur: 'quatre',
									tranches: [
										{ plafond: 1, taux: 0.1 },
										{ plafond: 2, taux: 1.8 },
										{ 'au-dessus de': 2, taux: 10 }
									]
								}
							}}
						]
					}
				}
			,
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
			top: 'oui',
			'top . sum': { formule: 'deux' },
			'top . deux': {
				'non applicable si':'top . sum . evt',
				formule: 2,
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
			top: 'oui',
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
			top: 'oui',
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
})
