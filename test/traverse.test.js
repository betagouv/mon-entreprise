import { expect } from 'chai'
import { analyse, parseAll } from '../source/engine/traverse'
import { enrichRule } from '../source/engine/rules'

let stateSelector = () => null

describe('analyse', function() {
	it('should directly return simple numerical values', function() {
		let rule = { nom: 'startHere', formule: 3269 }
		let rules = parseAll([rule].map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 3269)
	})

	it('should compute expressions combining constants', function() {
		let rule = { nom: 'startHere', formule: '32 + 69' }
		let rules = parseAll([rule].map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 101)
	})
})

describe('analyse on raw rules', function() {
	it('should handle direct referencing of a variable', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: 'dix', espace: 'top' },
				{ nom: 'dix', formule: 10, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 10)
	})

	it('should handle expressions referencing other rules', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: '3259 + dix', espace: 'top' },
				{ nom: 'dix', formule: 10, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 3269)
	})

	it('should handle applicability conditions', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: '3259 + dix', espace: 'top' },
				{ nom: 'dix', formule: 10, espace: 'top', 'non applicable si': 'vrai' },
				{ nom: 'vrai', formule: '2 > 1', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 3259)
	})

	it('should handle comparisons', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: '3259 > dix', espace: 'top' },
				{ nom: 'dix', formule: 10, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', true)
	})

	/* TODO: make this pass
  it('should handle applicability conditions', function() {
    let rawRules = [
          {nom: "startHere", formule: "3259 + dix", espace: "top"},
          {nom: "dix", formule: 10, espace: "top", "non applicable si" : "vrai"},
          {nom: "vrai", formule: "1", espace: "top"}],
        rules = rawRules.map(enrichRule)
    expect(analyse(rules,"startHere")(stateSelector).targets[0]).to.have.property('nodeValue',3259)
  });
  */
})

describe('analyse with mecanisms', function() {
	it('should handle n-way "or"', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: { 'une de ces conditions': ['1 > 2', '1 > 0', '0 > 2'] }
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', true)
	})

	it('should handle n-way "and"', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: { 'toutes ces conditions': ['1 > 2', '1 > 0', '0 > 2'] }
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', false)
	})

	it('should handle switch statements', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						'aiguillage numérique': {
							'1 > dix': '1000%',
							'3 < dix': '1100%',
							'3 > dix': '1200%'
						}
					},
					espace: 'top'
				},
				{ nom: 'dix', formule: 10, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 11)
	})

	it('should handle percentages', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', formule: '35%', espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 0.35)
	})

	it('should handle sums', function() {
		let rawRules = [
				{ nom: 'startHere', formule: { somme: [3200, 'dix', 9] } },
				{ nom: 'dix', formule: 10 }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 3219)
	})

	it('should handle multiplications', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						multiplication: {
							assiette: 3259,
							plafond: 3200,
							facteur: 1,
							taux: 1.5
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 4800)
	})

	it('should handle components in multiplication', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						multiplication: {
							assiette: 3200,
							composantes: [{ taux: 0.7 }, { taux: 0.8 }]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 4800)
	})

	it('should apply a ceiling to the sum of components', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						multiplication: {
							assiette: 3259,
							plafond: 3200,
							composantes: [{ taux: 0.7 }, { taux: 0.8 }]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 4800)
	})

	it('should handle progressive scales', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						barème: {
							assiette: 2008,
							multiplicateur: 1000,
							tranches: [
								{ 'en-dessous de': 1, taux: 0.1 },
								{ de: 1, à: 2, taux: 1.2 },
								{ 'au-dessus de': 2, taux: 10 }
							]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 100 + 1200 + 80)
	})

	it('should handle progressive scales with components', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						barème: {
							assiette: 2008,
							multiplicateur: 1000,
							composantes: [
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.4 },
										{ 'au-dessus de': 2, taux: 5 }
									]
								},
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.8 },
										{ 'au-dessus de': 2, taux: 5 }
									]
								}
							]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 100 + 1200 + 80)
	})

	it('should handle progressive scales with variations', function() {
		let rawRules = [
				{
					nom: 'startHere',
					formule: {
						barème: {
							assiette: 2008,
							multiplicateur: 1000,
							variations: [
								{
									si: '3 > 4',
									alors: {
										tranches: [
											{ 'en-dessous de': 1, taux: 0.1 },
											{ de: 1, à: 2, taux: 1.2 },
											{ 'au-dessus de': 2, taux: 10 }
										]
									}
								},
								{
									si: '3 > 2',
									alors: {
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
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 100 + 1800 + 80)
	})

	it('should handle max', function() {
		let rawRules = [
				{ nom: 'startHere', formule: { 'le maximum de': [3200, 60, 9] } }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 3200)
	})

	it('should handle complements', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: { complément: { cible: 'dix', montant: 93 } },
					espace: 'top'
				},
				{ nom: 'dix', formule: 17, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 93 - 17)
	})

	it('should handle components in complements', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					formule: {
						complément: {
							cible: 'dix',
							composantes: [{ montant: 93 }, { montant: 93 }]
						}
					},
					espace: 'top'
				},
				{ nom: 'dix', formule: 17, espace: 'top' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 2 * (93 - 17))
	})

	it('should handle filtering on components', function() {
		let rawRules = [
				{ nom: 'top' },
				{ nom: 'startHere', espace: 'top', formule: 'composed [salarié]' },
				{
					nom: 'composed',
					espace: 'top',
					formule: {
						barème: {
							assiette: 2008,
							multiplicateur: 1000,
							composantes: [
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.4 },
										{ 'au-dessus de': 2, taux: 5 }
									],
									attributs: { 'dû par': 'salarié' }
								},
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.8 },
										{ 'au-dessus de': 2, taux: 5 }
									],
									attributs: { 'dû par': 'employeur' }
								}
							]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 50 + 400 + 40)
	})

	it('should compute consistent values', function() {
		let rawRules = [
				{ nom: 'top' },
				{
					nom: 'startHere',
					espace: 'top',
					formule: 'composed [salarié] + composed [employeur]'
				},
				{ nom: 'orHere', espace: 'top', formule: 'composed' },
				{
					nom: 'composed',
					espace: 'top',
					formule: {
						barème: {
							assiette: 2008,
							multiplicateur: 1000,
							composantes: [
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.4 },
										{ 'au-dessus de': 2, taux: 5 }
									],
									attributs: { 'dû par': 'salarié' }
								},
								{
									tranches: [
										{ 'en-dessous de': 1, taux: 0.05 },
										{ de: 1, à: 2, taux: 0.8 },
										{ 'au-dessus de': 2, taux: 5 }
									],
									attributs: { 'dû par': 'employeur' }
								}
							]
						}
					}
				}
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(analyse(rules, 'orHere')(stateSelector).targets[0]).to.have.property(
			'nodeValue',
			100 + 1200 + 80
		)
		expect(
			analyse(rules, 'startHere')(stateSelector).targets[0]
		).to.have.property('nodeValue', 100 + 1200 + 80)
	})
})

describe('Implicit parent applicability', function() {
	it('should make a variable non applicable if one parent is input to false', function() {
		let rawRules = [
				{ nom: 'CDD', question: 'CDD ?' },
				{ nom: 'surcoût', formule: 10, espace: 'CDD' }
			],
			rules = parseAll(rawRules.map(enrichRule))
		expect(
			analyse(rules, 'CDD . surcoût')(name => ({ CDD: false }[name])).targets[0]
		).to.have.property('nodeValue', 0)
	})
})
