import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { SUPPORTED_LANGUAGES } from '@/locales/langue'
import { declaredPaths, routeLabels } from '@/services/routing'

import { readRouteTree } from '../build/readRouteTree'
import { pageRoutes } from '../build/translatedRoutes'

const appDir = fileURLToPath(new URL('../app', import.meta.url))

const pathsServingAPage = pageRoutes(
	readRouteTree(appDir, () => undefined)
).map(({ original }) => original)

describe('les routes déclarées', () => {
	it('ne déclarent que des chemins servis par une page', () => {
		const unknownPaths = declaredPaths.filter(
			(chemin) => !pathsServingAPage.includes(chemin)
		)

		expect(unknownPaths).toEqual([])
	})

	it('ne déclarent pas de motif de route dynamique', () => {
		const patterns = declaredPaths.filter((chemin) => chemin.includes(':'))

		expect(patterns).toEqual([])
	})

	it.each(SUPPORTED_LANGUAGES)('ont un libellé en %s', (langue) => {
		const libellés = routeLabels(langue)

		const cheminsSansLibellé = declaredPaths.filter(
			(chemin) => !libellés[chemin]
		)

		expect(cheminsSansLibellé).toEqual([])
	})
})
