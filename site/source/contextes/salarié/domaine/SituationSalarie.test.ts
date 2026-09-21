import rules from 'modele-social'
import Engine from 'publicodes'
import { describe, expect, it } from 'vitest'

import { situationSalarié } from './SituationSalarie'

describe('situationSalarié', () => {
	it('est acceptée par le modèle social', () => {
		expect(() => new Engine(rules).setSituation(situationSalarié)).not.toThrow()
	})

	it('place le moteur du côté salarié, pas dirigeant', () => {
		const moteur = new Engine(rules).setSituation(situationSalarié)

		expect(moteur.evaluate('dirigeant').nodeValue).toBe(false)
	})

	it('écarte l’imposition de l’entreprise du calcul', () => {
		const moteur = new Engine(rules).setSituation(situationSalarié)

		expect(moteur.evaluate('entreprise . imposition').nodeValue).toBe(false)
	})
})
