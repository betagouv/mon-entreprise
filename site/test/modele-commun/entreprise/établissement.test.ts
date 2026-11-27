import rules from 'modele-ti'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Domiciliation', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('outre-mer', () => {
		const RULE = 'établissement . domiciliation . outre-mer'

		it('est fausse par défaut', () => {
			expect(engine).toEvaluate(RULE, false)
		})

		describe('en répondant à la question sur l’outre-mer', () => {
			it.each([['mayotte'], ['drom hors mayotte']])(
				'est vraie pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'paramètres . domiciliation . distinction alsace-moselle': 'non',
						'établissement . outre-mer': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it('est fausse pour "métropole"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'métropole'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})

		describe('en répondant à la question sur la zone', () => {
			it.each([['mayotte'], ['drom hors mayotte']])(
				'est vraie pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . zone': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it.each([['autre'], ['alsace-moselle']])(
				'est fausse pour "%s"',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . zone': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, false)
				}
			)
		})

		describe('en répondant à la question sur la commune', () => {
			it.each([
				['Guadeloupe'],
				['Guyane'],
				['La Réunion'],
				['Martinique'],
				['Mayotte'],
			])('est vraie en sélectionnant une commune de %s', (réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, true)
			})

			it.each([
				['Bas-Rhin'],
				['Haut-Rhin'],
				['Moselle'],
				['Ardèche'],
				['Rhône'],
				['Seine-Saint-Denis'],
				['Tarn'],
			])('est fausse en sélectionnant une commune de %s', (réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, false)
			})
		})
	})

	describe('outre-mer hors mayotte', () => {
		const RULE = 'établissement . domiciliation . outre-mer . hors mayotte'

		it('est nulle par défaut', () => {
			expect(engine).toEvaluate(RULE, null)
		})

		describe('en répondant à la question sur l’outre-mer', () => {
			it('est vraie pour "drom hors mayotte"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'drom hors mayotte'",
				})

				expect(e).toEvaluate(RULE, true)
			})

			it('est fausse pour "mayotte"', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . outre-mer': "'mayotte'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})

		describe('en répondant à la question sur la zone', () => {
			it('est vraie pour "drom hors mayotte"', () => {
				const e = engine.setSituation({
					'établissement . zone': "'drom hors mayotte'",
				})

				expect(e).toEvaluate(RULE, true)
			})

			it('est fausse pour "mayotte"', () => {
				const e = engine.setSituation({
					'établissement . zone': "'mayotte'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})

		describe('en répondant à la question sur la commune', () => {
			it.each([['Guadeloupe'], ['Guyane'], ['La Réunion'], ['Martinique']])(
				'est vraie en sélectionnant une commune de %s',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . commune . département': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it('est fausse en sélectionnant une commune de Mayotte', () => {
				const e = engine.setSituation({
					'établissement . commune . département': "'Mayotte'",
				})

				expect(e).toEvaluate(RULE, false)
			})
		})
	})

	describe('alsace-moselle', () => {
		const RULE = 'établissement . domiciliation . alsace-moselle'

		it('est fausse par défaut', () => {
			expect(engine).toEvaluate(RULE, false)
		})

		it('est vraie en répondant à "alsace-moselle" à la question sur la zone', () => {
			const e = engine.setSituation({
				'établissement . zone': "'alsace-moselle'",
			})

			expect(e).toEvaluate(RULE, true)
		})

		describe('en répondant à la question sur la commune', () => {
			it.each([['Bas-Rhin'], ['Haut-Rhin'], ['Moselle']])(
				'est vraie en sélectionnant une commune de %s',
				(réponse) => {
					const e = engine.setSituation({
						'établissement . commune . département': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, true)
				}
			)

			it.each([
				['Guadeloupe'],
				['Guyane'],
				['La Réunion'],
				['Martinique'],
				['Mayotte'],
				['Ardèche'],
				['Rhône'],
				['Seine-Saint-Denis'],
				['Tarn'],
			])('est fausse en sélectionnant une commune de %s', (réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, false)
			})
		})
	})
})

describe('Zone', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const RULE = 'établissement . zone'

	it('est non applicable sans la distinction Alsace-Moselle', () => {
		const e = engine.setSituation({
			'paramètres . domiciliation . distinction alsace-moselle': 'non',
		})

		expect(e).not.toBeApplicable(RULE)
	})

	it('vaut "autre" par défaut', () => {
		expect(engine).toEvaluate(RULE, 'autre')
	})

	describe('en répondant à la question sur la commune', () => {
		it('vaut "mayotte" en sélectionnant une commune de Mayotte', () => {
			const e = engine.setSituation({
				'établissement . commune . département': "'Mayotte'",
			})

			expect(e).toEvaluate(RULE, 'mayotte')
		})

		it.each([['Guadeloupe'], ['Guyane'], ['La Réunion'], ['Martinique']])(
			'vaut "drom hors mayotte" en sélectionnant une commune de %s',
			(réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, 'drom hors mayotte')
			}
		)

		it.each([['Bas-Rhin'], ['Haut-Rhin'], ['Moselle']])(
			'vaut "alsace-moselle" en sélectionnant une commune de %s',
			(réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, 'alsace-moselle')
			}
		)

		it.each([['Ardèche'], ['Rhône'], ['Seine-Saint-Denis'], ['Tarn']])(
			'vaut "autre" en sélectionnant une commune de %s',
			(réponse) => {
				const e = engine.setSituation({
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, 'autre')
			}
		)
	})
})

describe('Outre-mer', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const RULE = 'établissement . outre-mer'

	it('est non applicable par défaut', () => {
		expect(engine).not.toBeApplicable(RULE)
	})

	describe('sans la distinction Alsace-Moselle', () => {
		it('vaut "métropole" par défaut', () => {
			const e = engine.setSituation({
				'paramètres . domiciliation . distinction alsace-moselle': 'non',
			})

			expect(e).toEvaluate(RULE, 'métropole')
		})

		describe('en répondant à la question sur la commune', () => {
			it('vaut "mayotte" en sélectionnant une commune de Mayotte', () => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . commune . département': "'Mayotte'",
				})

				expect(e).toEvaluate(RULE, 'mayotte')
			})

			it.each([['Guadeloupe'], ['Guyane'], ['La Réunion'], ['Martinique']])(
				'vaut "drom hors mayotte" en sélectionnant une commune de %s',
				(réponse) => {
					const e = engine.setSituation({
						'paramètres . domiciliation . distinction alsace-moselle': 'non',
						'établissement . commune . département': `"${réponse}"`,
					})

					expect(e).toEvaluate(RULE, 'drom hors mayotte')
				}
			)

			it.each([
				['Bas-Rhin'],
				['Haut-Rhin'],
				['Moselle'],
				['Ardèche'],
				['Rhône'],
				['Seine-Saint-Denis'],
				['Tarn'],
			])('vaut "métropole" en sélectionnant une commune de %s', (réponse) => {
				const e = engine.setSituation({
					'paramètres . domiciliation . distinction alsace-moselle': 'non',
					'établissement . commune . département': `"${réponse}"`,
				})

				expect(e).toEvaluate(RULE, 'métropole')
			})
		})
	})
})
