import { expect, it } from 'vitest'

import { configProfessionLibérale } from '@/pages/simulateurs/profession-libérale/simulationConfig'

import professionsLibéralesSituations from './professions-libérales.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-professions-libérales', () => {
	runSimulations(
		professionsLibéralesSituations,
		[
			...(configProfessionLibérale['objectifs exclusifs'] ?? []),
			...(configProfessionLibérale.objectifs ?? []),
		],
		{
			...configProfessionLibérale.situation,
			'entreprise . activité . nature . libérale . réglementée': 'oui',
		}
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...configProfessionLibérale.situation,
					'entreprise . activité . nature . libérale . réglementée': 'oui',
				})
				.evaluate('dirigeant . rémunération . net')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . indépendant . IJSS",
		  "dirigeant . indépendant . PL . CNAVPL . exonération incapacité",
		  "dirigeant . indépendant . PL . métier",
		  "dirigeant . indépendant . conjoint collaborateur",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . âge",
		  "dirigeant . indépendant . cotisations facultatives",
		  "dirigeant . indépendant . revenus étrangers",
		  "dirigeant . rémunération . net",
		  "entreprise . activités",
		  "entreprise . activités . agricole",
		  "entreprise . activités . artisanale",
		  "entreprise . activités . commerciale",
		  "entreprise . activités . libérale",
		  "entreprise . activités . saisonnière",
		  "entreprise . catégorie juridique . remplacements",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . date de cessation",
		  "entreprise . date de création",
		  "entreprise . imposition . régime",
		  "entreprise . imposition . régime . micro-entreprise",
		  "impôt . foyer fiscal . enfants à charge",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . foyer fiscal . situation de famille",
		  "impôt . méthode de calcul",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
