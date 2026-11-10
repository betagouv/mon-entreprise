import { describe, expect, it } from 'vitest'

import { generatePath, matchPath } from '@/lib/navigation'

import { lienVersLAutreLangue } from './lienVersLAutreLangue'

const lien = (urlDeLAutreLangue: string, langue: 'fr' | 'en', chemin: string) =>
	lienVersLAutreLangue({
		urlDeLAutreLangue,
		langue,
		chemin,
		matchPath,
		generatePath,
	})

describe('lienVersLAutreLangue', () => {
	it('traduit un chemin français vers son équivalent du site anglais', () => {
		expect(
			lien(
				'https://mycompanyinfrance.urssaf.fr',
				'fr',
				'/simulateurs/salaire-brut-net'
			)
		).toBe('https://mycompanyinfrance.urssaf.fr/calculators/salary')
	})

	it('traduit un chemin anglais vers son équivalent du site français', () => {
		expect(
			lien('https://mon-entreprise.urssaf.fr', 'en', '/calculators/salary')
		).toBe('https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net')
	})

	it('traduit un chemin paramétré en reportant ses paramètres', () => {
		expect(
			lien('https://mycompanyinfrance.urssaf.fr', 'fr', '/nouveautés/2024-03')
		).toBe('https://mycompanyinfrance.urssaf.fr/news/2024-03')
	})

	it('retombe sur la racine quand le chemin n’a pas d’équivalent', () => {
		expect(
			lien('https://mycompanyinfrance.urssaf.fr', 'fr', '/page-inconnue')
		).toBe('https://mycompanyinfrance.urssaf.fr/')
	})

	it('ne produit aucun lien quand le site de l’autre langue n’est pas configuré', () => {
		expect(lien('', 'fr', '/simulateurs/salaire-brut-net')).toBe('')
	})
})
