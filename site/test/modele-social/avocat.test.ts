import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Un avocat', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const chiffreDAffaires = 6264

	const situation = {
		'dirigeant . indépendant . cotisations facultatives': 'oui',
		'entreprise . activité . nature . libérale . réglementée': 'oui',
		'dirigeant . indépendant . PL . métier': "'avocat'",
		'entreprise . activité . nature': "'libérale'",
		'entreprise . date de création': '01/01/2021',
		"entreprise . chiffre d'affaires": `${chiffreDAffaires} €/an`,
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
	}

	it('est un indépendant', () => {
		const e = engine.setSituation(situation)
		expect(e).toEvaluate('entreprise . catégorie juridique', 'EI')
		expect(e).toEvaluate('dirigeant . régime social', 'indépendant')
	})

	it('paie des cotisations inférieures à son chiffre d’affaires', () => {
		const e = engine.setSituation(situation)

		const cotisations = e.evaluate(
			'dirigeant . rémunération . cotisations'
		).nodeValue

		expect(cotisations).toSatisfy((c: number) => c > 0 && c < chiffreDAffaires)
	})
})
