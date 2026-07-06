import rules from 'modele-social'
import Engine from 'publicodes'
import { afterAll, describe, expect, it } from 'vitest'

import { createTestApp } from './test-server.js'

describe('Cohérence de résultat entre NPM vs API', () => {
	const testApp = createTestApp()

	afterAll(() => {
		testApp.close()
	})

	const compareNPMEtAPI = async (expressions, situation) => {
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

			return resultNPM.nodeValue
	}

	it('pour une profession libérale avec charges', async () => {
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

		await compareNPMEtAPI(expressions, situation)
	})

	it('pour des dividendes en 2026', async () => {
		const situation = {
			'bénéficiaire': 'oui',
			'entreprise . catégorie juridique': "'SAS'",
			'impôt . méthode de calcul': "'barème standard'",
			'dirigeant . rémunération . net . imposable': '0 €/an',
			'bénéficiaire . dividendes . bruts': '10000 €/an',
			'date': "'01/01/2026'",
		}

		const expressions = [
			{
				valeur: "bénéficiaire . dividendes . nets d'impôt",
				unité: '€/an',
			},
		]

		const valeur = await compareNPMEtAPI(expressions, situation)

		expect(valeur).toBe(8_140)
	})

	it('pour des dividendes en 2025', async () => {
		const situation = {
			'bénéficiaire': 'oui',
			'entreprise . catégorie juridique': "'SAS'",
			'impôt . méthode de calcul': "'barème standard'",
			'dirigeant . rémunération . net . imposable': '0 €/an',
			'bénéficiaire . dividendes . bruts': '10000 €/an',
			'date': "'01/01/2025'",
		}

		const expressions = [
			{
				valeur: "bénéficiaire . dividendes . nets d'impôt",
				unité: '€/an',
			},
		]

		await compareNPMEtAPI(expressions, situation)
	})

	it('pour le coût total employeur d’un salaire brut de 3 400 €', async () => {
		const situation = {
			dirigeant: 'non',
			'entreprise . catégorie juridique': "''",
			'entreprise . imposition': 'non',
			'salarié . activité partielle': 'non',
			// 'impôt . méthode de calcul . par défaut': "'taux neutre'",
			'salarié . contrat . salaire brut': '3400 €/mois',
		}

		const expressions = [
			{
				valeur: 'salarié . coût total employeur',
				unité: '€/mois',
			},
		]

		const valeur = await compareNPMEtAPI(expressions, situation) as number

		expect(Math.round(valeur)).toBe(4_632)
	})

	it('pour le coût total employeur d’un salaire brut de 10 000 €', async () => {
		const situation = {
			dirigeant: 'non',
			'entreprise . catégorie juridique': "''",
			'entreprise . imposition': 'non',
			'salarié . activité partielle': 'non',
			// 'impôt . méthode de calcul . par défaut': "'barème standard'",
			'salarié . contrat . salaire brut': '10000 €/mois',
		}

		const expressions = [
			{
				valeur: 'salarié . coût total employeur',
				unité: '€/mois',
			},
		]

		await compareNPMEtAPI(expressions, situation)
	})
})
