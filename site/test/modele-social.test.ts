import rules, { RègleModeleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeAll, describe, expect, it } from 'vitest'

describe('modele-social', function () {
	let engine: Engine<RègleModeleSocial>
	beforeAll(() => {
		engine = new Engine(rules)
	})
	it("ne change pas le montant de l'IR ni des cotisations lorsqu'on verse un forfait mobilités durables", function () {
		expect(
			engine
				.setSituation({ 'salarié . contrat . salaire brut': 2300 })
				.evaluate('impôt . montant').nodeValue
		).toEqual(
			engine
				.setSituation(
					{
						'salarié . rémunération . frais professionnels . trajets domicile travail . forfait mobilités durables . montant': 500,
					},
					{ keepPreviousSituation: true }
				)
				.evaluate('impôt . montant').nodeValue
		)
	})
})
