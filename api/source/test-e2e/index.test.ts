import chai from 'chai'
import chaiHttp from 'chai-http'
import { describe, expect, it } from 'vitest'

import { server } from '../index.js'

chai.use(chaiHttp)

const transformResult = (obj: Record<string, unknown>) => {
	if (obj && Array.isArray(obj.evaluate) && obj.evaluate.length > 0) {
		return {
			...obj,
			evaluate: obj.evaluate.map(
				(elem: { missingVariables: Record<string, unknown> }) => ({
					...elem,
					missingVariables: Object.keys(elem.missingVariables).sort(),
				})
			),
		}
	}

	return obj
}

describe('e2e test mon-entreprise api', () => {
	it('Test evaluate brut => net + super brut', async () => {
		await expect(
			chai
				.request(server)
				.post('/api/v1/evaluate')
				.send({
					situation: {
						'salarié . contrat . salaire brut': '3500 €',
					},
					expressions: [
						'salarié . rémunération . net . à payer avant impôt',
						'salarié . coût total employeur',
					],
				})
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return transformResult(
						JSON.parse(res.text) as Record<string, unknown>
					)
				})
		).resolves.toMatchSnapshot()
	})

	it('Test evaluate micro entreprise', async () => {
		await expect(
			chai
				.request(server)
				.post('/api/v1/evaluate')
				.send({
					situation: {
						'entreprise . activité . nature': "'libérale'",
						'entreprise . activité . nature . libérale . réglementée': 'non',
						'entreprise . date de création': '03/05/2019',
						'entreprise . catégorie juridique': "'EI'",
						'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
						"dirigeant . auto-entrepreneur . chiffre d'affaires": '42000 €/an',
						'dirigeant . auto-entrepreneur . impôt . versement libératoire':
							'non',
						'impôt . méthode de calcul': "'taux neutre'",
					},
					expressions: [
						{
							valeur:
								'dirigeant . auto-entrepreneur . cotisations et contributions',
							unité: '€/an',
						},
						'dirigeant . rémunération . impôt',
						'dirigeant . auto-entrepreneur . revenu net . après impôt',
					],
				})
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return transformResult(
						JSON.parse(res.text) as Record<string, unknown>
					)
				})
		).resolves.toMatchSnapshot()
	})

	it('Test evaluate avocat (test units)', async () => {
		await expect(
			chai
				.request(server)
				.post('/api/v1/evaluate')
				.send({
					situation: {
						'dirigeant . indépendant . cotisations facultatives': 'oui',
						'entreprise . activité . nature . libérale . réglementée': 'oui',
						'dirigeant . indépendant . PL . métier': "'avocat'",
						'entreprise . activité . nature': "'libérale'",
						'entreprise . date de création': '01/01/2013',
						"entreprise . chiffre d'affaires": '6264 €/an',
						'entreprise . catégorie juridique': "'EI'",
						'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
					},
					expressions: [
						// 'dirigeant . régime social',
						// 'dirigeant . indépendant',
						// 'dirigeant . rémunération . totale',
						// 'dirigeant . rémunération . cotisations',
						// 'dirigeant . rémunération . net',
						'dirigeant . rémunération . net . après impôt',
					],
				})
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return transformResult(
						JSON.parse(res.text) as Record<string, unknown>
					)
				})
		).resolves.toMatchSnapshot()
	})

	it('Test openapi.json endpoint', async () => {
		await expect(
			chai
				.request(server)
				.get('/api/v1/openapi.json')
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return transformResult(
						JSON.parse(res.text) as Record<string, unknown>
					)
				})
		).resolves.toMatchSnapshot()
	})

	it('Test doc endpoint', async () => {
		await expect(
			chai
				.request(server)
				.get('/api/v1/doc/')
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return res.text
				})
		).resolves.toMatchInlineSnapshot(`
			"<!-- HTML for static distribution bundle build -->
			<!DOCTYPE html>
			<html lang=\\"en\\">
			  <head>
			    <meta charset=\\"UTF-8\\">
			    <title>Swagger UI</title>
			    <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"./swagger-ui.css\\" />
			    <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"index.css\\" />
			    <link rel=\\"icon\\" type=\\"image/png\\" href=\\"./favicon-32x32.png\\" sizes=\\"32x32\\" />
			    <link rel=\\"icon\\" type=\\"image/png\\" href=\\"./favicon-16x16.png\\" sizes=\\"16x16\\" />
			  </head>

			  <body>
			    <div id=\\"swagger-ui\\"></div>
			    <script src=\\"./swagger-ui-bundle.js\\" charset=\\"UTF-8\\"> </script>
			    <script src=\\"./swagger-ui-standalone-preset.js\\" charset=\\"UTF-8\\"> </script>
			    <script src=\\"./swagger-initializer.js\\" charset=\\"UTF-8\\"> </script>
			  </body>
			</html>
			"
		`)
	})

	it('Test json mal formaté', async () => {
		const response = await chai
			.request(server)
			.post('/api/v1/evaluate')
			.set('Content-Type', 'application/json')
			.send('{ x: bad json }')

		expect(response.status).toBe(400)
		expect(response.text.includes('in JSON at position 2')).toEqual(true)
	})
})
