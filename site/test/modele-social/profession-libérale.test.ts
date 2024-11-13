import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

const situationProfessionLibérale = {
	salarié: 'non',
	'entreprise . activité . nature': "'libérale'",
	'entreprise . catégorie juridique': "'EI'",
	'entreprise . imposition': "'IR'",
	'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
}

describe('Une profession libérale', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const situationCIPAV = {
		...situationProfessionLibérale,
		'entreprise . activité . nature . libérale . réglementée': 'oui',
	}

	describe('en CIPAV ACRE', () => {
		const situationCIPAVACRE = {
			...situationCIPAV,
			'dirigeant . rémunération . net': '5000 €/an',
			'dirigeant . exonérations . ACRE': 'oui',
			'entreprise . date de création': '11/11/2023',
		}

		it('paie une retraite de base', () => {
			const e = engine.setSituation(situationCIPAVACRE)

			expect(e).toBeApplicable('dirigeant . indépendant . PL')
			expect(e).toEvaluate('protection sociale . retraite . base', 38)
		})
	})
})
