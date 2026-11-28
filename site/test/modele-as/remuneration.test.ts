import rules from 'modele-as'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Assimilé salarié', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	describe('avec une rémunération totale de 0 €', () => {
		const situation = {
			'assimilé salarié . rémunération . totale': '0 €/an',
		}

		it.each([
			'assimilé salarié . rémunération . salaire brut',
			'assimilé salarié . rémunération . brute',
			'assimilé salarié . rémunération . nette . à payer avant impôt',
			'assimilé salarié . rémunération . nette . après impôt',
			'assimilé salarié . cotisations',
		])('calcule une valeur nulle pour « %s »', (dottedName) => {
			const e = engine.setSituation(situation)

			expect(e).toEvaluate(dottedName, 0)
		})
	})
})
