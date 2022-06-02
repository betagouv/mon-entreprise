import chaiHttp from 'chai-http'
import { chai, describe, expect, it } from 'vitest'
import { server } from '../index.js'

chai.use(chaiHttp)

describe('e2e test mon-entreprise api', () => {
	it('Test evaluate brut => net + super brut', async () => {
		await expect(
			chai
				.request(server)
				.post('/api/v1/evaluate')
				.send({
					situation: {
						'contrat salarié . rémunération . brut de base': '3500 €',
					},
					expressions: [
						'contrat salarié . rémunération . net',
						'contrat salarié . prix du travail',
					],
				})
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return JSON.parse(res.text) as Record<string, unknown>
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
						'entreprise . activité': "'libérale'",
						'entreprise . activité . libérale réglementée': 'non',
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
						'dirigeant . auto-entrepreneur . net après impôt',
					],
				})
				.then((res) => {
					expect(res.status).toMatchInlineSnapshot('200')

					return JSON.parse(res.text) as Record<string, unknown>
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

					return JSON.parse(res.text) as Record<string, unknown>
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
})
