import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('scénario tout simple', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it('works', () => {
		engine.setSituation({
			"entreprise . chiffre d'affaires": {
				valeur: 100000,
				unité: '€/an',
			},
			'entreprise . catégorie juridique': "'EI'",
			'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',

			'entreprise . activité . nature': "'libérale'",
			'entreprise . activité . nature . libérale . réglementée': 'non',
			salarié: 'non',
			'dirigeant . auto-entrepreneur': 'oui',
		})

		// expect(engine).toEvaluate(
		// 	{
		// 		valeur: 'dirigeant . auto-entrepreneur . revenu net',
		// 		unité: '€/an',
		// 	},
		// 	76700
		// )

		expect(engine).toEvaluate(
			{
				valeur: 'dirigeant . rémunération . net . après impôt',
				unité: '€/an',
			},
			63614
		)
	})
})
