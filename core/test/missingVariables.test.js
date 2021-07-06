import { expect } from 'chai'
import Engine from '../source/index'
import { parse } from 'yaml'

describe('Missing variables', function () {
	it('should identify missing variables', function () {
		// Rules in tests can be expressed in YAML like to for more clarity than JS objects
		const rawRules = parse(`
ko: oui
sum: oui
sum . startHere:
  formule: 2
  non applicable si: sum . evt . ko
sum . evt:
  formule:
    une possibilité:
      - ko
  titre: Truc
  question: '?'
sum . evt . ko:
`)

		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.include('sum . evt')
	})

	it('should identify missing variables mentioned in expressions', function () {
		const rawRules = {
			sum: 'oui',
			'sum . evt': 'oui',
			'sum . startHere': {
				formule: 2,
				'non applicable si': 'evt . nyet > evt . nope',
			},
			'sum . evt . nope': {},
			'sum . evt . nyet': {},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.include('sum . evt . nyet')
		expect(result).to.include('sum . evt . nope')
	})

	it('should ignore missing variables in the formula if not applicable', function () {
		const rawRules = {
			sum: 'oui',
			'sum . startHere': {
				formule: 'trois',
				'non applicable si': '3 > 2',
			},
			'sum . trois': {},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	it('should not report missing variables when "one of these" short-circuits', function () {
		const rawRules = {
			sum: 'oui',
			'sum . startHere': {
				formule: 'trois',
				'non applicable si': {
					'une de ces conditions': ['3 > 2', 'trois'],
				},
			},
			'sum . trois': {},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('sum . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	it('should report "une possibilité" as a missing variable even though it has a formula', function () {
		const rawRules = {
			top: 'oui',
			ko: 'oui',
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] },
			},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . startHere').missingVariables
		)

		expect(result).to.include('top . trois')
	})

	it('should not report missing variables when "une possibilité" is inapplicable', function () {
		const rawRules = {
			top: 'oui',
			ko: 'oui',
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] },
				'non applicable si': 'oui',
			},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . startHere').missingVariables
		)

		expect(result).to.be.empty
		null
	})

	it('should not report missing variables when "une possibilité" was answered', function () {
		const rawRules = {
			top: 'oui',
			ko: 'oui',
			'top . startHere': { formule: 'trois' },
			'top . trois': {
				formule: { 'une possibilité': ['ko'] },
			},
		}
		const result = Object.keys(
			new Engine(rawRules)
				.setSituation({ 'top . trois': "'ko'" })
				.evaluate('top . startHere').missingVariables
		)

		expect(result).to.be.empty
	})

	it('should report missing variables in simple variations', function () {
		const rawRules = parse(`

somme: a + b
a: 10
b:
  formule:
    variations: 
      - si: a > 100
        alors: c
      - sinon: 0
c:
  question: Alors ?`)
		const result = Object.keys(
			new Engine(rawRules).evaluate('somme').missingVariables
		)

		expect(result).to.have.lengthOf(0)
	})

	// TODO : réparer ce test
	it('should report missing variables in variations', function () {
		const rawRules = parse(`
startHere:
  formule:
    somme:
      - variations
variations:
  formule:
    variations:
      - si: dix
        alors:
          barème:
            assiette: 2008
            multiplicateur: deux
            tranches:
              - plafond: 1
                taux: 0.1
              - plafond: 2
                taux: trois
              - taux: 10
      - si: 3 > 4
        alors: 
          barème:
            assiette: 2008
            multiplicateur: quatre
            tranches:
              - plafond: 1
                taux: 0.1
              - plafond: 2
                taux: 1.8
              - au-dessus de: 2
                taux: 10

dix: {}
deux: {}
trois: {}
quatre: {}

      `)
		const result = Object.keys(
			new Engine(rawRules).evaluate('startHere').missingVariables
		)

		expect(result).to.include('dix')
		expect(result).to.include('deux')
		expect(result).to.include('trois')
		expect(result).not.to.include('quatre')
	})
})

describe('nextSteps', function () {
	it('should generate questions for simple situations', function () {
		const rawRules = {
			top: 'oui',
			'top . sum': { formule: 'deux' },
			'top . deux': {
				'non applicable si': 'top . sum . evt',
				formule: 2,
			},
			'top . sum . evt': {
				titre: 'Truc',
				question: '?',
			},
		}

		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})
	it('should generate questions', function () {
		const rawRules = {
			top: 'oui',
			'top . sum': { formule: 'deux' },
			'top . deux': {
				formule: 'sum . evt',
			},
			'top . sum . evt': {
				question: '?',
			},
		}

		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.have.lengthOf(1)
		expect(result[0]).to.equal('top . sum . evt')
	})

	it('should generate questions with more intricate situation', function () {
		const rawRules = {
			top: 'oui',
			'top . sum': { formule: { somme: [2, 'deux'] } },
			'top . deux': {
				formule: 2,
				'non applicable si': "top . sum . evt = 'ko'",
			},
			'top . sum . evt': {
				formule: { 'une possibilité': ['ko'] },
				titre: 'Truc',
				question: '?',
			},
			'top . sum . evt . ko': {},
		}
		const result = Object.keys(
			new Engine(rawRules).evaluate('top . sum').missingVariables
		)

		expect(result).to.eql(['top . sum . evt'])
	})

	it("Parent's other descendands in sums should not be included as missing variables", function () {
		// See https://github.com/betagouv/publicodes/issues/33
		const rawRules = parse(`
transport:
  somme: 
    - voiture
    - avion

transport . voiture:
  formule: empreinte * km

transport . voiture . empreinte: 0.12
transport . voiture . km: 
  question: COMBIENKM
  par défaut: 1000

transport . avion:
  applicable si: usager
  formule: empreinte * km

transport . avion . km: 
  question: COMBIENKM
  par défaut: 10000

transport . avion . empreinte: 0.300

transport . avion . usager:
  question: Prenez-vous l'avion ?
  par défaut: oui
`)
		const result = Object.keys(
			new Engine(rawRules).evaluate('transport . avion').missingVariables
		)

		expect(result).deep.to.equal([
			'transport . avion . km',
			'transport . avion . usager',
		])
		expect(result).to.have.lengthOf(2)
	})
	it("Parent's other descendands in sums should not be included as missing variables - 2", function () {
		// See https://github.com/betagouv/publicodes/issues/33
		const rawRules = parse(`
avion:
  question: prenez-vous l'avion ?
  par défaut: oui

avion . impact:
  formule:
    somme:
      - au sol
      - en vol

avion . impact . en vol:
  question: Combien de temps passé en vol ?
  par défaut: 10

avion . impact . au sol: 5
`)
		const result = Object.keys(
			new Engine(rawRules).evaluate('avion . impact . au sol').missingVariables
		)

		expect(result).deep.to.equal(['avion'])
		expect(result).to.have.lengthOf(1)
	})

	it("Parent's other descendands in sums in applicability should be included as missing variables", function () {
		// See https://github.com/betagouv/publicodes/issues/33
		const rawRules = parse(`
a:
  applicable si: d > 3
  valeur: oui

d: 
 formule: 
   somme: 
     - e
     - 8

e: 
  question: Vous venez à combien à la soirée ?
  par défaut: 3

a . b: 20 + 9
`)
		const result = Object.keys(
			new Engine(rawRules).evaluate('a . b').missingVariables
		)

		expect(result).deep.to.equal(['e'])
		expect(result).to.have.lengthOf(1)
	})
})
