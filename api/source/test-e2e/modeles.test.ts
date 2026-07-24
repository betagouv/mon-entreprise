import { afterAll, describe, expect, it } from 'vitest'

import { createTestApp } from './test-server.js'

describe('L’API', () => {
	const testApp = createTestApp()

	afterAll(() => {
		testApp.close()
	})

	it.each([
		[
			'modèle-social',
			'/evaluate',
			{
				situation: {
					'salarié . contrat . salaire brut': '4200 €/mois',
				},
				expressions: ['salarié . rémunération . net . à payer avant impôt'],
			},
		],
		[
			'modele-ti',
			'/modeles/ti/evaluate',
			{
				situation: {
					'entreprise . imposition': "'IR'",
					"entreprise . chiffre d'affaires": '50000 €/an',
				},
				expressions: ['indépendant . rémunération . nette'],
			},
		],
		[
			'modele-as',
			'/modeles/as/evaluate',
			{
				situation: {
					'assimilé salarié . rémunération . brute': '50000 €/an',
				},
				expressions: ['assimilé salarié . rémunération . nette . après impôt'],
			},
		],
	])(
		'permet d’évaluer une expression de %s',
		async (_libellé, path, requestBody) => {
			const apiResponse = await testApp.post(`/api/v1${path}`).send(requestBody)

			expect(apiResponse.status).toBe(200)

			const apiResult = JSON.parse(apiResponse.text)

			expect(apiResult).toHaveProperty('evaluate')
			expect(apiResult.evaluate).toHaveLength(1)
			expect(apiResult.evaluate[0]).toHaveProperty('nodeValue')
			expect(apiResult.evaluate[0].nodeValue).toBeTypeOf('number')
		}
	)

	it.each([
		['modèle-social', '/rules'],
		['modele-ti', '/modeles/ti/rules'],
		['modele-as', '/modeles/as/rules'],
	])('permet de lister toutes les règles de %s', async (_libellé, path) => {
		const apiResponse = await testApp.get(`/api/v1${path}`).send()

		expect(apiResponse.status).toBe(200)
	})

	it.each([
		[
			'modèle-social',
			'/rules/salarié . rémunération . net . à payer avant impôt',
			'Salaire net',
		],
		[
			'modele-ti',
			'/modeles/ti/rules/indépendant . rémunération . nette',
			'Rémunération nette',
		],
		[
			'modele-as',
			'/modeles/as/rules/assimilé salarié . rémunération . nette . à payer avant impôt',
			'Salaire net',
		],
	])('permet de récupérer une règle de %s', async (_libellé, path, titre) => {
		const apiResponse = await testApp.get(encodeURI(`/api/v1${path}`)).send()

		expect(apiResponse.status).toBe(200)

		const apiResult = JSON.parse(apiResponse.text)

		expect(apiResult).toHaveProperty('title')
		expect(apiResult.title).toBe(titre)
	})
})
