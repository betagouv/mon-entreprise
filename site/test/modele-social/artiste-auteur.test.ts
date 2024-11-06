import rules, { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

import { Situation } from '@/domaine/Situation'

describe('Un artiste-auteur', () => {
	let engine: Engine<DottedName>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const situation: Situation = {
		'artiste-auteur': 'oui',
		salarié: 'oui',
	}

	describe('salarié à 1000 €/an', () => {
		const situationSalarié = {
			...situation,
			salarié: 'oui',
			'artiste-auteur . revenus . traitements et salaires': '1000 €/an',
		}

		it('paie des cotisations', () => {
			const e = engine.setSituation(situationSalarié)

			expect(e).toEvaluate('artiste-auteur . cotisations', 160)
		})

		it('ne paie pas d’IRCEC', () => {
			const e = engine.setSituation(situationSalarié)

			expect(e).toEvaluate('artiste-auteur . cotisations . IRCEC', 0)
		})
	})

	describe('avec un revenu BNC de 10 000 €/an', () => {
		const situationBNC = {
			...situation,
			'artiste-auteur . revenus . BNC . recettes': '10000 €/an',
		}

		it('paie des cotisations', () => {
			const e = engine.setSituation(situationBNC)

			expect(e).toEvaluate('artiste-auteur . cotisations', 1230)
		})
	})
})
