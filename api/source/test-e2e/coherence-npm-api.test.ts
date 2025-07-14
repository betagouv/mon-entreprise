import rules from 'modele-social'
import Engine from 'publicodes'
import { afterAll, describe, expect, it } from 'vitest'

import { createTestApp } from './test-server.js'

describe('Cohérence de résultat entre NPM vs API', () => {
	const testApp = createTestApp()

	afterAll(() => {
		testApp.close()
	})

	it('donne le même résultat pour une profession libérale avec charges', async () => {
		const situation = {
			'entreprise . activité . nature': "'libérale'",
			'entreprise . catégorie juridique': "'EI'",
			'entreprise . imposition': "'IR'",
			'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
			'entreprise . activité . nature . libérale . réglementée': 'non',
			"entreprise . chiffre d'affaires": 42000,
			'entreprise . charges': 26000,
		}

		const expressions = [
			{
				valeur: 'dirigeant . indépendant . cotisations et contributions',
				unité: '€/an',
			},
		]

		const engineNPM = new Engine(rules, {
			warn: {
				deprecatedSyntax: false,
				experimentalRules: false,
				cyclicReferences: false,
			},
		})
		engineNPM.setSituation(situation)
		const resultNPM = engineNPM.evaluate(expressions[0])

		const apiResponse = await testApp.post('/api/v1/evaluate').send({
			situation,
			expressions,
		})

		expect(apiResponse.status).toBe(200)
		const apiResult = JSON.parse(apiResponse.text)

		expect(resultNPM.nodeValue).toBe(apiResult.evaluate[0].nodeValue)
	})
})
