import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Auto-entrepreneur', function () {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const situation = {
		'entreprise . catégorie juridique': "'EI'",
		'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
	}

	it('a le régime social auto-entrepreneur', function () {
		engine.setSituation(situation)

		expect(engine).toEvaluate('dirigeant . régime social', 'auto-entrepreneur')
	})
	describe('dans un DROM', () => {
		const situationDrom = {
			...situation,
			'établissement . commune . département . outre-mer': 'oui',
			"dirigeant . auto-entrepreneur . chiffre d'affaires": '20000 €/an',
			'entreprise . activités . revenus mixtes': 'oui',
			"entreprise . chiffre d'affaires . service BIC": '12000 €/an',
			"entreprise . chiffre d'affaires . service BNC": '3000 €/an',
			"entreprise . chiffre d'affaires . vente restauration hébergement":
				'5000 €/an',
		}

		it('a un revenu net de', () => {
			engine.setSituation(situationDrom)

			expect(engine).toEvaluate(
				'dirigeant . auto-entrepreneur . revenu net',
				17440
			)
		})
	})
})
