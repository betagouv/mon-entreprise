import { describe, expect, it } from 'vitest'

import { pathToPageData } from './analytics.js'

describe('pathToPageData', () => {
	it('associe le modèle social aux routes de calcul par défaut', () => {
		expect(pathToPageData('/api/v1/evaluate')).toEqual({
			page: 'evaluate',
			page_chapter1: 'api',
			page_chapter2: 'v1',
			page_chapter3: 'modele-social',
		})
		expect(pathToPageData('/api/v1/rules')).toMatchObject({
			page: 'rules',
			page_chapter3: 'modele-social',
		})
	})

	it('distingue les modèles via page_chapter3', () => {
		expect(pathToPageData('/api/v1/modeles/ti/evaluate')).toMatchObject({
			page: 'evaluate',
			page_chapter3: 'modele-ti',
		})
		expect(pathToPageData('/api/v1/modeles/as/rules')).toMatchObject({
			page: 'rules',
			page_chapter3: 'modele-as',
		})
	})

	it('n’associe aucun modèle aux routes hors calcul', () => {
		expect(pathToPageData('/api/v1/openapi.json')).not.toHaveProperty(
			'page_chapter3'
		)
		expect(pathToPageData('/api/v1/doc')).not.toHaveProperty('page_chapter3')
	})
})
